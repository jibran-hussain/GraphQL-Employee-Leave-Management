import Employee from '../models/employee.js';
import Leave from '../models/leaves.js';
import { Op, where } from 'sequelize';
import 'dotenv/config'
import bcrypt from 'bcrypt';
import { generateHashedPassword } from '../utils/Auth/generateHashedPassword.js';
import { isValidNumber } from '../utils/Validation/isValidMobile.js';
import {passwordValidation} from '../utils/Validation/validations.js'
import sequelize from '../../index.js';
import {generateAuthToken} from '../utils/Auth/geneateAuthToken.js'
import Otp from '../models/otp.js';
import { generateEmailOtp } from '../utils/OTP/generateOtp.js';
import { emailOtpConfig,smsOtpConfig } from '../config/otp.js';
import sendEmail from '../utils/email/sendEmail.js';
import sendSms from '../utils/sms/sendSms.js'
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';


// This method gives the list of all active and deactivated employees.
// Can be accessed by only admin and superadmin
// Can sort them bassed on any field in ascending and descending order. Can also perform global search.

export const listAllEmployees = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const offset = Number(req.query.offset) || 1;
        const sortBy = req.query.sortBy;
        const order = req.query.order === 'desc' ? 'DESC' : 'ASC';
        const search = req.query.search;
        const deleted = req.query.deleted;

        if ((limit && !offset) || (!limit && offset)) {
            return res.status(400).json({ error: 'Either limit or offset is necessary' });
        }

        if(sortBy && (sortBy != 'id' && sortBy != 'name' && sortBy != 'email' && sortBy != 'mobileNumber' && sortBy != 'salary' && sortBy != 'role' && sortBy != 'leavesLeft' && sortBy != 'createdAt' && sortBy != 'updatedAt')) return res.status(400).json({error:`Please enter a valid field for using sorting`})

        const startIndex = (offset - 1)*limit;

        const whereClause={
            role:['admin','employee','superadmin']
        }

        if(deleted !== 'false' &&  deleted !== 'true' && deleted !== undefined) return res.status(400).json({error:`Invalid option for listing deleted employees`})
        if(deleted === 'true') whereClause.deletedAt={[Op.not]:null}
        
        if(search){
            whereClause[Op.or]=[
                {name:{[Op.iLike]:`%${search}%`}},
                {email:{[Op.iLike]:`%${search}%`}},
                {role:{[Op.iLike]:`%${search}%`}},
                {designation:{[Op.iLike]:`%${search}%`}},
                sequelize.literal(`CAST ("Employee"."id" AS TEXT) ILIKE '%${search}%'`),
                sequelize.literal(`CAST ("mobileNumber" AS TEXT) ILIKE '%${search}%'`),
                sequelize.literal(`CAST ("salary" AS TEXT) ILIKE '%${search}%'`),
            ]
        }

        const {count,rows:employees}=await Employee.findAndCountAll({
            where:whereClause,
            order:sortBy?[[sortBy,order]]:[],
            offset:startIndex || undefined,
            limit:limit || undefined,
            attributes:{
                exclude:['hashedPassword'],
            },
            paranoid:deleted === 'true'?false:true

        }
        )

        if(count === 0) return res.status(404).json({error:`The list is empty`})

        if(limit && offset){
            const totalPages = Math.ceil(count/limit);
            if(offset > totalPages) return res.status(404).json({error:`This page does not exist`})
            return res.json({
                data:employees,
                metadata:{
                    totalEmployees:count,
                    currentPage:offset,
                    totalPages
                }
            })
        }

        return res.json({ data:employees});
    } catch (e) {
        console.log(e)
        return res.status(500).json({ error:e.message });
    }
};


// It activates the employee account.
// Admin and Superadmin can activate employees account and Superadmin can activate admin's account.
// Admin cannot activate fellow admin's account

export const activateAccount=async (req,res)=>{
    try{
        const employeeId=Number(req.params.employeeId)
        const employeeToActivate=await Employee.findByPk(employeeId,{
            paranoid:false
        });

        if(!employeeToActivate) return res.status(404).json({error:'Employee with this id does not exist'});

        if(req.auth.role === 'superadmin'){
            await Employee.restore({
                where:{
                    id:employeeId
                }
            })
        }

        else if(req.auth.role === 'admin' && (employeeToActivate.role === 'admin' || employeeToActivate.role === 'superadmin' )) return res.status(403).json({error:`You are not authorized to activate this employee's account`})

        else if(req.auth.role === 'admin' && employeeToActivate.role === 'employee'){
            await Employee.restore({
                where:{
                    id:employeeId
                }
            })
        }
        return res.json({message:"Employee account activated Successfully"})
        
    }catch(e){
        return res.status(500).json({error:e.message})
    }
}


// Give the details of the logged in user.
// Can be accessed by everyone who is logged in irrespective of role

export const getLoggedUsersDetails=async(req,res)=>{
    try{
        const {id}=req.auth;

        const employee= await Employee.findByPk(id,{
            attributes:{exclude:['hashedPassword','deletedAt']},
            include:[
                {
                    model:Leave,
                    attributes:{exclude:['employeeId','deletedAt']},
                }
            ]
        });

        return res.json({data:employee})
    }catch(e){
        console.log(e.message)
        return res.status(500).json({error:e.message})
    }
}

// It deletes an employee.
// Admin can delete normal employees account but cannot delete fellow admin's account.
// Superadmin can delete both admin's and employee's account
// It does not delete permenantly, it does soft delete so the user can be reactivated.

export const deleteEmployee=async (req,res)=>{
    try{
        const employeeId=Number(req.params.employeeId)
        const employeeToDelete=await Employee.findByPk(employeeId);
        if(!employeeToDelete) return res.status(404).json({error:'Employee with this id does not exist'});

        if(employeeToDelete.role === 'superadmin') return res.status(403).json({error:`You are not authorized to delete this employee`})

        else if(req.auth.role === 'superadmin'){
            await Employee.destroy({
                where:{
                    id:employeeId
                }
            })
        }
        else if(req.auth.role === 'admin' && (employeeToDelete.role === 'admin' || employeeToDelete.role === 'superadmin' )) return res.status(403).json({error:`You are not authorized to delete this employee`})

        else if(req.auth.role === 'admin' && employeeToDelete.role === 'employee'){
            await Employee.destroy({
                where:{
                    id:employeeId
                }
            })
        }

        return res.json({message:`Employee's account has been deactivated succesfully`})
    }catch(e){
        return res.status(500).json({error:`Internal Server Error`})
    }
}


// Soft deletes a user which is currently logged in

export const deleteMe= async(req,res)=>{
    try{
        await Employee.destroy({
            where:{
                id:req.auth.id
            }
        })
        return res.json({message:`Your account has been deactivated successfully`});
    }catch(e){
        return res.status(500).json({error:`Internal Server Error`});
    }
}

// Superadmin,Admin,Employees can update their profile

export const updateProfile= async(req,res)=>{
    try{
        const employeeId=req.auth.id;
        if(Object.keys(req.body).length == 0) return res.status(400).json({error:`You have not provided any details to update`})

        const {name,mobileNumber,profilePictureURL}=req.body;

        if(name && name.length < 3) return res.status(400).json({error:'Name should be of atleast 3 characters'})

        if(mobileNumber && !isValidNumber(mobileNumber))  return res.status(400).json({error:`Please enter a valid mobile number`});

        const updatedObject={};
        if(name) updatedObject.name=name;
        if(mobileNumber) updatedObject.mobileNumber=mobileNumber;
        if(profilePictureURL) updatedObject.profilePictureURL=profilePictureURL;

        const updatedEmployee=await Employee.update(updatedObject,{
            where:{
                id:employeeId
            }
        })

        if(updatedEmployee[0] === 0) return res.status(403).json({error:`Employee did not udpate`});

        return res.json({message:"User updated Successfully"})
    }catch(e){
        return res.status(500).json({error:e.message})
    }
}

// It is used to fetch employee's details by its id.
// Admin and Superadmin can fetch everyone's detail.

export const getEmployeeDetails= async(req,res)=>{
    try{
        const employeeId=Number(req.params.employeeId);
        const employee=await Employee.findByPk(employeeId,{
            paranoid:false,
            include:[
                {
                    model:Leave,
                    attributes:{
                        exclude:['employeeId','deletedAt']
                    }
                }
            ]
        });
        if(!employee) return res.status(404).json({error:`Employee with this id does not exist`});
        employee.hashedPassword=undefined;
        return res.json({data:employee});
    }catch(e){
        return res.status(500).json({error:e.message})
    }
}


// It will be used by admin and superadmin to update employees deatils.
// Admin's cannot update their fellow admin's details.

export const updateEmployeeProfile=async(req,res)=>{
    try{
        const employeeId=Number(req.params.employeeId);

        if(Object.keys(req.body).length === 0) return res.status(400).json({error:`You have not provided any details to update`});
        
        const {name,mobileNumber,role,designation,password,salary,profilePictureURL}=req.body;

        if(name && name.length < 3) return res.status(400).json({error:'Name should be of atleast 3 characters'})

        if(mobileNumber && !isValidNumber(mobileNumber))  return res.status(400).json({error:`Please enter a valid mobile number`});

        if(salary && !Number(salary)) return res.status(400).json({error:"Please enter valid salary"})
    
        const employeeToUpdate=await Employee.findByPk(employeeId);

        if(!employeeToUpdate) return res.status(404).json({error:`Employee with this id does not exist`});


        if(employeeToUpdate.role === 'superadmin') return res.status(403).json({error:'You are not authorized to update the details of this employee (Forbidden)'})

        if(req.auth.role === 'admin' && (employeeToUpdate.role === 'admin' || employeeToUpdate.role === 'superadmin')) return res.status(403).json({error:'You are not authorized to update the details of this employee (Forbidden)'})

        const updatedObject={}

        if(name) updatedObject.name=name;
        if(mobileNumber) updatedObject.mobileNumber=mobileNumber;
        if(role) updatedObject.role=role;
        if(designation) updatedObject.designation=designation;
        if(password) updatedObject.hashedPassword=generateHashedPassword(password);
        if(salary) updatedObject.salary=salary
        if(profilePictureURL) updatedObject.profilePictureURL=profilePictureURL;

        const updatedEmployee=await Employee.update(updatedObject,{
            where:{
                id:employeeId
            }
        })

        if(updatedEmployee[0] === 0) return res.status(403).json({error:`Employee did not udpate`});

        return res.json({message: 'Employee updated successfully'})
    }catch(e){
        return res.status(500).json({error:e.message})
    }
}


export const updateEmployeeProfileByPut=async(req,res)=>{
    try{
        const employeeId=Number(req.params.employeeId);
        const {name,mobileNumber,role,designation,password,salary}=req.body;
        
        if(!name) return res.status(400).json({error:`Please provide name`});

        if(!password) return res.status(400).json({error:`Please provide password`});

        if(!role) return res.status(400).json({error:`Please provide role`});

        if(!designation) return res.status(400).json({error:`Please provide designation`});

        if(name.length < 3) return res.status(400).json({error:`Name should be of atleast 3 characters`})

        // Checks whether password is Empty
        if(passwordValidation(password)) return res.status(400).json({error:`Password cannot be empty and should have more than 3 characters`})

        if(role != 'admin' && role != 'employee') return res.status(400).json({error:`Please enter a valid role`})

        if(mobileNumber && !isValidNumber(mobileNumber))  return res.status(400).json({error:`Please enter a valid mobile number`});

        if(salary && !Number(salary)) return res.status(400).json({error:"Please enter valid salary"})
        
        const employee=await Employee.findByPk(employeeId)

        if(!employee) return res.status(404).json({error:`Employee with this id does not exist`})

        if(req.auth.role === 'admin' && (employee.role === 'admin' || employee.role === 'superadmin')) return res.status(403).json({error:'You are not authorized to update the details of this employee (Forbidden)'})


        const updatedObject={
            name:employee.name,
            email:employee.email,
            hashedPassword:employee.hashedPassword,
            mobileNumber:null,
            salary:null,
            designation:employee.designation,
            role:employee.role,
            leavesLeft:null,
            active:null
        };

        if(name) updatedObject.name=name;
        if(password) updatedObject.hashedPassword=generateHashedPassword(password);
        if(mobileNumber) updatedObject.mobileNumber=mobileNumber;
        if(role) updatedObject.role=role;
        if(designation) updatedObject.designation=designation;
        if(salary) updatedObject.salary=salary;

        await Employee.update(updatedObject,{
            where:{
                id:employeeId
            }
        })

        return res.json({message: 'Employee updated successfully'})
    }catch(e){
        console.log(e)
        return res.status(500).json({error:e.message})
    }
}


export const updatedProfileByPutMethod= async(req,res)=>{
    try{
        const employeeId=req.auth.id;
        const {name,mobileNumber,profilePictureURL}=req.body;

        if(!name) return res.status(400).json({error:`Please provide name`});

 
        if(name.length < 3) return res.status(400).json({error:'Name should be of atleast 3 characters'})

        if(mobileNumber && !isValidNumber(mobileNumber))  return res.status(400).json({error:`Please enter a valid mobile number`});

        const employee=await Employee.findByPk(employeeId)

        const updatedObject={
            name,
            email:employee.email,
            hashedPassword:employee.hashedPassword,
            mobileNumber:null,
            salary:null,
            role:employee.role,
            leavesLeft:null,
            profilePictureURL:null
        };
        if(mobileNumber) updatedObject.mobileNumber=mobileNumber;
        if(profilePictureURL) updatedObject.profilePictureURL=profilePictureURL;
        

        const updatedEmployee=await Employee.update(updatedObject,{
            where:{
                id:employeeId
            }
        })

        if(updatedEmployee[0] === 0) return res.status(403).json({error:`Employee did not udpate`});

        return res.json({message:"User updated Successfully"})
    }catch(e){
        console.log(e)
        return res.status(500).json({error:e.message})
    }
}

// It resets the password of currently logged in user

export const resetPassword=async(req,res)=>{
    try{
        const employeeId=req.auth.id;
        const {oldPassword,newPassword,confirmPassword}=req.body
        if(!oldPassword || !newPassword || !confirmPassword) return res.status(400).json({error:`All fields are necassary`});
        if(newPassword.toString() !== confirmPassword.toString()) return res.status(400).json({error:`New Password and confirm password should be same`})
        
        if(passwordValidation(newPassword) || passwordValidation(confirmPassword)) return res.status(400).json({error:`Password cannot be empty and should have more than 3 characters`})

        // check if the old password is correct or not
        const employee = await Employee.findByPk(employeeId);
        const isValidPassword=await bcrypt.compare(oldPassword,employee.hashedPassword);
        if(!isValidPassword)    return res.status(400).json({error:`You have entered incorrect old password`});
        const newHashedPassword= generateHashedPassword(newPassword)

        await Employee.update({hashedPassword:newHashedPassword},{
            where:{
                id:employeeId
            }
        })

        return res.json({message:"Password changed successfully"})
    }catch(e){
        console.log(e)
        return res.status(500).json({error:`Internal server error`})
    }
}


export const manageMfaSettings= async(req,res)=>{
    try{
        const employeeId = req.auth.id;

        const employee = await Employee.findByPk(employeeId);

        const {enableMfa,emailOtp,smsOtp,totp, totpSecret} = req.body;

        console.log(req.body,'totp')

        // Update MFA settings based on enableMfa flag
        if(enableMfa){

            // Clone the existing MFA settings
            const updatedMfaOptions={...employee.mfaSettings};

            // Update individual MFA options based on request body
            emailOtp?updatedMfaOptions.emailOtp = true:updatedMfaOptions.emailOtp = false;

            smsOtp?updatedMfaOptions.smsOtp = true:updatedMfaOptions.smsOtp = false;

            totp?updatedMfaOptions.totp = true:updatedMfaOptions.totp = false;

            // Determine the default MFA option from environment variables
            const defaultMfaOption = process.env.DEFAULT_MFA_OPTION;

            const isAllDisabled = Object.values(updatedMfaOptions).every(mfaOptions=> mfaOptions === false)

            // If all MFA options are disabled, enable the default MFA option
            if(isAllDisabled) updatedMfaOptions[defaultMfaOption] = true;

            // Update employee's MFA settings in the database
            await Employee.update({mfaEnabled:true, mfaSettings: {...employee.mfaSettings,...updatedMfaOptions}},{
                where:{
                    id: employeeId
                }   
            })

            if(totpSecret){
                await Otp.update({totpSecret},{
                    where:{
                        employeeId
                    }   
                })
            }
        }else{
            // Disable MFA for the employee and reset all MFA options
            await Employee.update({mfaEnabled:false,mfaSettings: {...employee.mfaSettings,emailOtp:false, smsOtp:false, totp:false}},{
                where:{
                    id: employeeId
                }
            })
        }

        return res.json({message:"Changes saved successfully"})
        
    }catch(error){
        console.error("Error in manageMfaSettings:", error);
        return res.status(500).json({error:error.message});
    }
}

export const sendOTP = async(req,res)=>{
    try{
        const employeeId = Number(req.query.employeeId);
        const employee = await Employee.findByPk(employeeId)

        if(!employee) return res.status(404).json({error: `Employee with this id does not exist`});

        const {emailOtp,smsOtp,totp} = req.body;

        const otp = generateEmailOtp();

        if(emailOtp){
            // If the OTP is to be sent over the email

            const emailOtpExpiry = new Date(Date.now() + emailOtpConfig.expiryTime);

            const isEmailOtpExisting = await Otp.findByPk(employee.id);
            
            if(isEmailOtpExisting){
                await Otp.update({emailOtp:otp,emailOtpExpiry },{
                    where:{
                        employeeId:employee.id
                    }
                });
            }else{
                await Otp.create({employeeId:employee.id,emailOtp:otp,emailOtpExpiry });
            } 

            
            sendEmail('"Jibran" <jibran@mir.com>',`${employee.email}`,'OTP verification',`The OTP for signin is ${otp}. It will expire in ${emailOtpConfig.expiryTime/1000/60} minutes`,`The OTP for signin is ${otp}. It will expire in ${emailOtpConfig.expiryTime/1000/60} minutes`)
            return res.json({message: 'OTP has been sent to your registered email address',employeeId:employee.id});
        }else if(smsOtp){
            // If the OTP is to be sent over the SMS

            const smsOtpExpiry = new Date(Date.now() + smsOtpConfig.expiryTime);

            const isSmsOtpExisting = await Otp.findByPk(employee.id);

            if(isSmsOtpExisting){
                await Otp.update({smsOtp:otp,smsOtpExpiry },{
                    where:{
                        employeeId:employee.id
                    }
                });
            }else{
                await Otp.create({employeeId:employee.id,smsOtp:otp,smsOtpExpiry });
            } 
            
            const message = `Your OTP (One Time Password) for signing in is ${otp}`;
            const countryCode = '+91'
            sendSms(countryCode + employee.mobileNumber,message)
            return res.json({message: 'OTP has been sent to your registered mobile number',employeeId:employee.id});

        }

    }catch(error){
        console.log(error)
        return res.status(500).json({error: error.message})
    }
}

export const resendOTP=async(req,res)=>{
    try{
        const employeeId = Number(req.query.employeeId);
        const employee = await Employee.findByPk(employeeId)

        if(!employee) return res.status(404).json({error: `Employee with this id does not exist`});

        // Retrieve OTP record of the employee
        const otpRecord = await Otp.findByPk(employee.id);

        const {emailOtp,smsOtp} = req.body;

        // Config details regarding sending otp over email
        const resendLimit=emailOtpConfig.resendLimit;
        const cooldownPeriod = emailOtpConfig.cooldownPeriod;
        const maxResendDuration = emailOtpConfig.maxResendDuration;

        // Check condition whether the OTP is to be sent over Email or SMS.
        if(emailOtp){
            // If the OTP is to be sent over email
            
            // Generating the OTP for email
            const otp = generateEmailOtp();

            // Setting the OTP expiry time
            const emailOtpExpiry = new Date(Date.now() + emailOtpConfig.expiryTime);

            // If resend OTP has reached its maximum limit and the cooldown period is not over yet
            if(otpRecord.emailOtpResendAttemptsCount >= resendLimit && otpRecord.emailOtplastResendAttempt && Date.now() - new Date(otpRecord.emailOtplastResendAttempt).getTime() < cooldownPeriod){
                return res.status(403).json({ error: 'Maximum resend attempts exceeded. Please wait before trying again.' });
            }

            // If resend OTP has reached its maximum limit but the cooldown period is over
            else if(otpRecord.emailOtpResendAttemptsCount >= resendLimit && otpRecord.emailOtplastResendAttempt && Date.now() - new Date(otpRecord.emailOtplastResendAttempt).getTime() > cooldownPeriod){
                await Otp.update({emailOtp:otp,emailOtpExpiry,emailOtpResendAttemptsCount:1,emailOtplastResendAttempt:new Date(),emailOtpFirstResendAttempt: new Date()},{where:{
                    employeeId:employee.id
                }})
            }

            // If resend OTP has not reached its maximum limit and current time is greater than the max recent duration
            else if(otpRecord.emailOtpResendAttemptsCount <= resendLimit && otpRecord.emailOtplastResendAttempt && Date.now() > (otpRecord.emailOtpFirstResendAttempt.getTime() + maxResendDuration)){
                
                await Otp.update({emailOtp:otp,emailOtpExpiry,emailOtpResendAttemptsCount:1,emailOtplastResendAttempt:new Date(),emailOtpFirstResendAttempt: new Date()},{where:{
                    employeeId:employee.id
                }})
            }

            // Normal case of resending OTP
            else if(otpRecord.emailOtpResendAttemptsCount < resendLimit){

                if(otpRecord.emailOtpResendAttemptsCount < 1){
                    await Otp.update({emailOtp:otp,emailOtpExpiry,emailOtpResendAttemptsCount:otpRecord.emailOtpResendAttemptsCount+1,emailOtplastResendAttempt:new Date(),emailOtpFirstResendAttempt: new Date() },{
                        where:{
                            employeeId:employee.id
                        }
                    });
                    
                }else{
                    await Otp.update({emailOtp:otp,emailOtpExpiry,emailOtpResendAttemptsCount:otpRecord.emailOtpResendAttemptsCount+1,emailOtplastResendAttempt:new Date() },{
                        where:{
                            employeeId:employee.id
                        }
                    });
                }
            }
            
            sendEmail('"Jibran" <jibran@mir.com>',`${employee.email}`,'OTP verification',`The OTP for signin is ${otp}. It will expire in ${emailOtpConfig.expiryTime/1000/60} minutes`,`The OTP for signin is ${otp}. It will expire in ${emailOtpConfig.expiryTime/1000/60} minutes`)
            return res.json({message: 'OTP has been sent to your registered email address',employeeId:employee.id});

        }else if(smsOtp){
             // Handling OTP resending via SMS
            // Implementation for SMS OTP sending

             // If the OTP is to be sent over email
            
            // Generating the OTP for email
            const otp = generateEmailOtp();

            // Setting the OTP expiry time
            const smsOtpExpiry = new Date(Date.now() + smsOtpConfig.expiryTime);

            // If resend OTP has reached its maximum limit and the cooldown period is not over yet
            if(otpRecord.smsOtpResendAttemptsCount >= resendLimit && otpRecord.smsOtplastResendAttempt && Date.now() - new Date(otpRecord.smsOtplastResendAttempt).getTime() < cooldownPeriod){
                return res.status(403).json({ error: 'Maximum resend attempts exceeded. Please wait before trying again.' });
            }

            // If resend OTP has reached its maximum limit but the cooldown period is over
            else if(otpRecord.smsOtpResendAttemptsCount >= resendLimit && otpRecord.smsOtplastResendAttempt && Date.now() - new Date(otpRecord.smsOtplastResendAttempt).getTime() > cooldownPeriod){
                await Otp.update({smsOtp:otp,smsOtpExpiry,smsOtpResendAttemptsCount:1,smsOtplastResendAttempt:new Date(),smsOtpFirstResendAttempt: new Date()},{where:{
                    employeeId:employee.id
                }})
            }

            // If resend OTP has not reached its maximum limit and current time is greater than the max recent duration
            else if(otpRecord.smsOtpResendAttemptsCount <= resendLimit && otpRecord.smsOtplastResendAttempt && Date.now() > (otpRecord.smsOtpFirstResendAttempt.getTime() + maxResendDuration)){
                
                await Otp.update({smsOtp:otp,smsOtpExpiry,smsOtpResendAttemptsCount:1,smsOtplastResendAttempt:new Date(),smsOtpFirstResendAttempt: new Date()},{where:{
                    employeeId:employee.id
                }})
            }

            // Normal case of resending OTP
            else if(otpRecord.smsOtpResendAttemptsCount < resendLimit){

                if(otpRecord.smsOtpResendAttemptsCount < 1){
                    await Otp.update({smsOtp:otp,smsOtpExpiry,smsOtpResendAttemptsCount:otpRecord.smsOtpResendAttemptsCount+1,smsOtplastResendAttempt:new Date(),smsOtpFirstResendAttempt: new Date() },{
                        where:{
                            employeeId:employee.id
                        }
                    });
                    
                }else{
                    await Otp.update({smsOtp:otp,smsOtpExpiry,smsOtpResendAttemptsCount:otpRecord.smsOtpResendAttemptsCount+1,smsOtplastResendAttempt:new Date() },{
                        where:{
                            employeeId:employee.id
                        }
                    });
                }
            }
            
            const message = `The OTP for signin is ${otp}. It will expire in ${smsOtpConfig.expiryTime/1000/60} minutes`
            sendSms(employee.mobileNumber,message);
            return res.json({message: 'OTP has been sent to your registered mobile number',employeeId:employee.id});
        }
        
    }catch(error){
        console.log(`Error in resendOTP`,error)
        return res.status(500).json({error:error.message});
    }
}

export const verifyOTP=async(req,res)=>{
    try{
        const employeeId = Number(req.query.employeeId);
        const employee = await Employee.findByPk(employeeId);

        if(!employee) return res.status(404).json({error: `Employee with this id does not exist`});

        const {token,sms,email, totp} = req.body;

        // Verifying the otp
        const otpDetailsOfEmployee = await Otp.findByPk(employeeId);

        // If no OTP is registered against the employee
        if(!otpDetailsOfEmployee) return res.status(400).json({error: 'Incorrect OTP'})

        const currentDate = new Date(Date.now());

        if(totp){
            const isVerified = speakeasy.totp.verify({
                secret: otpDetailsOfEmployee.totpSecret,
                encoding: 'hex',
                token
            })
    
            if(isVerified){
                const jwtToken=generateAuthToken(employee.id,employee.email,employee.role)
                return res.json({ jwtToken })
            }
            else return res.status(400).json({error: 'Incorrect OTP'})
        }
        
        else if(email && otpDetailsOfEmployee.emailOtp === token && currentDate < otpDetailsOfEmployee.emailOtpExpiry){
            await Otp.update({emailOtpResendAttemptsCount:0,emailOtpFirstResendAttempt:null,emailOtplastResendAttempt:null},{
                where:{
                    employeeId:employee.id
                }
            })
            const jwtToken=generateAuthToken(employee.id,employee.email,employee.role)
            return res.json({ jwtToken })
        }else if(sms && otpDetailsOfEmployee.smsOtp === token && currentDate < otpDetailsOfEmployee.smsOtpExpiry){
            await Otp.update({smsOtpResendAttemptsCount:0,smsOtpFirstResendAttempt:null,smsOtplastResendAttempt:null},{
                where:{
                    employeeId:employee.id
                }
            })
            const jwtToken=generateAuthToken(employee.id,employee.email,employee.role)
            return res.json({ jwtToken })
        }

        return res.status(400).json({error: `Incorrect OTP`});
    }catch(error){
        console.log(error.message)
    }
}

export const getMfaDetailsofUser=async(req,res)=>{
    try{
        const employeeId = Number(req.query.employeeId);

        // Check if employeeId is valid or not
        if(isNaN(employeeId)) return res.status(400).json({error:`Please enter a valid employee id`})

        const employee = await Employee.findByPk(employeeId);

        // If employee is not found
        if(!employee) return res.status(404).json({error:`Employee with this id not found`})

        if(employee.mfaEnabled){

            // If MFA (Multi-Factor Authentication) is enabled for the employee

            const enabledMfaOptions = [];

            Object.keys(employee.mfaSettings).forEach(mfaOption => {
                if(employee.mfaSettings[mfaOption]) enabledMfaOptions.push(mfaOption)
            })

            return res.json({isMfaEnabled:true,enabledMfaOptions})

        }
        
        // If MFA is not enabled for the employee
        return res.json({isMfaEnabled:false})

    }catch(error){
        console.log(`Error in getMfaDetails`,error)
        return res.status(500).json({error:error.message});
    }
}

export const getTotpDetailForUser =async(req,res)=>{
    try{
        const secret = speakeasy.generateSecret({
            name:'Totp Generator'
        });
        console.log(secret)
        const qrCodeUrl =  await QRCode.toDataURL(secret.otpauth_url)
        return res.json({qrCodeUrl,totpSecret: secret.hex});
        
    }catch(error){
        console.log(`Error in getTotpDetailForUser`,error)
        return res.status(500).json({error:error.message});
    }
}


