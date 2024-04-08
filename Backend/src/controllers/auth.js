import { isValidEmail,passwordValidation } from "../utils/Validation/validations.js";
import { generateHashedPassword } from '../utils/Auth/generateHashedPassword.js';
import { isValidPassword } from '../utils/Validation/isValidPassword.js'
import { isValidNumber } from '../utils/Validation/isValidMobile.js';
import Employee from '../models/employee.js';
import sendEmail from "../utils/email/sendEmail.js";
import { generateAuthToken } from "../utils/Auth/geneateAuthToken.js";
import { generateEmailOtp } from "../utils/OTP/generateOtp.js";
import { emailOtpConfig, smsOtpConfig } from "../config/otp.js";
import Otp from "../models/otp.js";
import sendSms from "../utils/sms/sendSms.js";

// Creates an admin/employee wiht name,email,password,role,mobileNumber and salary as mandatory fileds.
// Admin can only be created by Superadmin.
// Employee can be created by both Superadmin and Admin.

export const createUser=async(req,res)=>{
    try{
        const {name,password,role,mobileNumber,profilePictureURL,salary,designation}=req.body;

        let{email}=req.body;

        if(!name ||!email || !password || !role || !designation) return res.status(400).json({error:'All fields are mandatory'})

        if(name.length < 3) return res.status(400).json({error:'Name should be of atleast 3 characters'})

        if(role != 'admin' && role != 'employee' && role != 'superadmin') return res.status(400).json({error:`Please enter a valid role`})


        if(req.auth.role === 'admin' && role === 'superadmin') return res.status(403).json({error:'You are not authorized to create a superadmin'});

        if(role === 'admin' && req.auth.role != 'superadmin') return res.status(403).json({error:'You are not authorized to create an admin. Please login as superadmin'});
        if(role === "employee" && (req.auth.role != 'superadmin' &&  req.auth.role != 'admin')) return res.status(403).json({error:'You are not authorized to create an employee. Please login as admin or superadmin'})

        // Trim the email and convert it into lowercase
        email=email.trim().toLowerCase();

        // Check if it is a valid email or not
        if(!isValidEmail(email)) return res.status(400).json({error:"Please enter valid email address"})

        // Checks whether password is Empty
        if(passwordValidation(password)) return res.status(400).json({error:`Password cannot be empty and should have more than 3 characters`})

        // checks if a number is valid or not
        if(mobileNumber && !isValidNumber(mobileNumber)) return res.status(400).json({error:`Please enter a valid mobile number`})

        // Validatin salary
        if(salary && (!Number(salary) || salary < 0)) return res.status(400).json({error:"Please enter a valid salary"})

        // Check whether employee of this email-id already exists or not
        const isEmailExisting=await Employee.findOne({where:{
            email
        },
        paranoid:false
    })

        if(isEmailExisting) return res.status(409).json({error:"Employee with this email already exists. Please try with another email id"})
            
        // Hashing the password
        const hashedPassword=generateHashedPassword(password);

        await Employee.create({name,email,hashedPassword,designation,mobileNumber,profilePictureURL,salary,role});

        return res.status(201).json({message:`Employee created successfully`});
        
    }catch(e){
        return res.status(500).json({error:`Internal Server Error`})
    }
}

// Superadmin,admin,employees can signin.
// name and password are mandatory fields.

export const userSignin=async(req,res)=>{
    try{
        const {password}=req.body; 
        let {email}=req.body

        if(!email || !password) return res.status(400).json({error:`All fields are necassary`})  

        // Trim the email and convert it into lowercase
        email=email.trim().toLowerCase();

        // Check if it is a valid email or not
        if(!isValidEmail(email)) return res.status(400).json({error:"Please enter valid email address"})

        // Checks whether password is Empty
        if(passwordValidation(password)) return res.status(400).json({error:`Password cannot be empty and should have more than 3 characters`})

        const employee=await Employee.findOne({where:{email}})
        
        if(!employee) return res.status(401).json({error:`Invalid credentials`});

        if(isValidPassword(password,employee.hashedPassword)){

            const enabledMfaOptionsOfEmployee=Object.keys(employee.mfaSettings).filter(mfaOption => employee.mfaSettings[mfaOption] === true)

            if(employee.mfaEnabled ){

                if(enabledMfaOptionsOfEmployee.length > 1) return res.json({message:'Signed in successfully',employeeId:employee.id})
                
                else if(enabledMfaOptionsOfEmployee.length === 1 && enabledMfaOptionsOfEmployee.includes('emailOtp')){
                    const otp = generateEmailOtp();
                    const emailOtpExpiry = new Date(Date.now() + emailOtpConfig.expiryTime);

                    const isOtpExisting = await Otp.findByPk(employee.id);

                    if(isOtpExisting){
                        await Otp.update({emailOtp:otp,emailOtpExpiry },{
                            where:{
                                employeeId:employee.id
                            }
                        });
                    }else{
                        await Otp.create({employeeId:employee.id,emailOtp:otp,emailOtpExpiry });
                    } 

                    
                    sendEmail('"Jibran" <jibran@mir.com>',`${email}`,'OTP verification',`The OTP for signin is ${otp}. It will expire in ${emailOtpConfig.expiryTime/1000/60} minutes `,`The OTP for signin is ${otp}. It will expire in ${emailOtpConfig.expiryTime/1000/60} minutes`)
                    return res.json({message: 'OTP has been sent to your registered email address',employeeId:employee.id});

                }else if(enabledMfaOptionsOfEmployee.length === 1 && enabledMfaOptionsOfEmployee.includes('smsOtp')){
                    const otp = generateSmsOtp();
                    const smsOtpExpiry = new Date(Date.now() + smsOtpConfig.expiryTime);

                    const isOtpExisting = await Otp.findByPk(employee.id);

                    if(isOtpExisting){
                        await Otp.update({smsOtp:otp,smsOtpExpiry },{
                            where:{
                                employeeId:employee.id
                            }
                        });
                    }else{
                        await Otp.create({employeeId:employee.id,smsOtp:otp,smsOtpExpiry });
                    } 

                    
                    // Here will be the send sms logic
                    const message = `The OTP for signin is ${otp}. It will expire in ${smsOtpConfig.expiryTime/1000/60} minutes`;
                    sendSms(employee.mobileNumber,message);
                    return res.json({message: 'OTP has been sent to your registered mobile number',employeeId:employee.id});
                }
            }
            else{
                const token=generateAuthToken(employee.id,employee.email,employee.role)
                 return res.json({
                         token
                    })
            }
           
        }else return res.status(401).json({error:`Invalid credentials`})
    }catch(e){
        console.log(e,'yerror')
       return res.status(500).json({error:e.message})
    }
}



