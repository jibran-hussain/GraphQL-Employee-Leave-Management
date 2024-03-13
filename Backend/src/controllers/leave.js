import 'dotenv/config'
import { Op, where } from 'sequelize';
import { isDateInPast } from '../utils/Date/isDateInPast.js';
import { getDatesArray } from '../utils/Date/getDatesArray.js';
import { getDate,getDateForDB } from '../utils/Date/getDate.js';
import { isValidDate } from '../utils/Date/isValidDate.js';
import Leave from '../models/leaves.js';
import Employee from '../models/employee.js';
import getTotalLeaveDays from '../utils/leaves/getTotalLeaveDays.js';
import sequelize from '../../index.js';

// It is used to apply for leave

export const applyForLeave=async (req,res)=>{
    try{
        const {id}=req.auth;
        let {fromDate,toDate,reason}=req.body;

        if(!fromDate || !toDate || !reason) return res.status(400).json({error:`All fields are necassary`})

        fromDate=getDate(fromDate);
        toDate=getDate(toDate);
    
        if(fromDate > toDate) return res.status(400).json({error:`Please enter a valid range`})
        
        if(isValidDate(fromDate) || isValidDate(toDate)) return res.status(400).json({error:'Please enter valid date'})

        isDateInPast(fromDate)
        isDateInPast(toDate)

        const {dates,leaveDuration}=await getDatesArray(id,fromDate,toDate,true);

        if(dates.length === 0 ) return res.status(403).json({error:`You are already on leave on these days or it is a weekend`})

        // Check if leaves are exhausted or not
        const employee=await Employee.findByPk(id);
        if(employee.leavesLeft <= 0) return res.status(403).json({error:"You have exhausted all your leaves"})

        if(dates.length > employee.leavesLeft) return res.status(403).json({error: `You have only ${employee.leavesLeft} leaves left and you are applying for  ${dates.length} days`})

        if(req.auth.role === 'superadmin') await Leave.create({reason,employeeId:id,dates,status:'approved'})
        else await Leave.create({reason,employeeId:id,dates})
        

        return res.status(201).json({message:`Leave created successfully`})
        
    }catch(e){
        console.log(e)
        res.status(500).json({error:e.message})
    }
}


export const listAllEmployeeLeaves=async (req,res)=>{
    try{

        const employeeId=Number(req.params.employeeId)

        const employee= await Employee.findByPk(employeeId,{paranoid:false});
        if(!employee) return res.status(404).json({error:`Emplyee with this id does not exist`});

        const limit=Number(req.query.limit) || 10;
        const offset=Number(req.query.offset) || 1;
        const status = req.query.status;
        const search=req.query.search;

        if(status && (status != 'approved' && status != 'Under Process' && status != "rejected")) return res.status(400).json({error:`Please enter a valid status`})

        if((limit && !offset) || (!limit && offset)) return res.status(400).json({error:'Either limit or offset is necassary'});

        const startIndex = (offset - 1)*limit;

        const whereClause={
            employeeId,
        };

        if(status) whereClause.status=status;

        if(search){
            whereClause[Op.or]=[
                {reason:{[Op.iLike]:`%${search}%`}},
                {status:{[Op.iLike]:`%${search}%`}},
                {rejectionReason:{[Op.iLike]:`%${search}%`}},
                sequelize.where(sequelize.fn('array_to_string', sequelize.col('dates'), ','), { [Op.iLike]: `%${search}%` }),
                sequelize.literal(`CAST ("Leave"."id" AS TEXT) ILIKE '%${search}%'`),
            ]
        }

        const {count,rows:allLeaves}=await Leave.findAndCountAll({
            where:whereClause,
            attributes:{
                exclude:['employeeId','deletedAt']
            },
            offset: startIndex || undefined,
            limit: limit || undefined,
            include:[
                {
                    model:Employee,
                    attributes:{
                        exclude:['employeeId','hashedPassword','deletedAt']
                    }
                }
            ]
        })

        if(count === 0) return res.status(404).json({error:`The employee has not taken any leave yet`});

        if(limit && offset){
            const totalPages=Math.ceil(count/ limit);

            if(offset > totalPages) return res.status(404).json({error:`This page does not exist`})

            const {totalLeaveDays}=await getTotalLeaveDays(employeeId)
            
            return res.json({data:allLeaves,metadata:{
                totalLeaveDays:totalLeaveDays,
                totalApplications:count,
                currentPage:offset,
                totalPages
            }})
        }


    }catch(e){
        return res.status(500).json({error:`Internal Server Error`})
    }

}

// It is used to modify the leaves of an employee
export const updateLeave=async(req,res)=>{
    try{
        const employeeId=req.auth.id;
        const leaveId=Number(req.params.leaveId);

         // Get employee details
         const employee=await Employee.findByPk(employeeId)
            
         const leave=await Leave.findByPk(leaveId);
         if(!leave || (leave && leave.employeeId !=  employeeId)) return res.status(404).json({error:`Leave not found`});

         if(leave.status != 'Under Process') return res.status(403).json({error:`You cannot update this leave`})

        let updatedLeave={};
        let {fromDate,toDate,reason}=req.body;
        if((fromDate && !toDate) || (toDate && ! fromDate)) return res.status(400).json({error:'Start date and End date is mandatory'});
        else if(fromDate && toDate){
            fromDate=getDate(fromDate);
            toDate=getDate(toDate);

            if(fromDate > toDate) return res.status(400).json({error:`Please enter a valid range`})

            isDateInPast(fromDate)
            isDateInPast(toDate)

            const currentDate=new Date();
            currentDate.setUTCHours(0,0,0,0)

            if(getDateForDB(leave.dates[leave.dates.length-1]) < currentDate) return res.status(403).json({error:'You cannot update this leave. Try deleting it and apply for fresh leave.'})
           
            const {dates,leaveDuration}=await getDatesArray(employeeId,fromDate,toDate,false,leaveId);

            if(employee.leavesLeft < leaveDuration) return res.status(403).json({error: 'You do not have enough leaves left'}) ;

            let dateRange=[...dates];

            if(dateRange.length === 0) return res.status(403).json({error:`You are already on leave on these dates or it's a weekend`})

            updatedLeave.dates=[...dateRange]

        }
        
        if(reason) updatedLeave.reason=reason;

        // Updating leaves
        await Leave.update(updatedLeave,{
            where:{
                id:leaveId
            }
        })

        return res.json({message:'Leave updated successfully'})          

    }catch(e){
        console.log(e)
        return res.status(500).json({error:e.message})
    }   
}

export const updateLeaveByPutMethod=async(req,res)=>{
    try{
        let {fromDate,toDate,reason}=req.body;


        if((fromDate && !toDate) || (toDate && ! fromDate)) return res.status(400).json({error:'Start date and End date is mandatory'});

        const employeeId=req.auth.id;
        const leaveId=Number(req.params.leaveId);     

        // Get employee details
        const employee=await Employee.findByPk(employeeId)

        if(fromDate || toDate){
            fromDate=getDate(fromDate);
            toDate=getDate(toDate);

            isDateInPast(toDate)

            
            const leave=await Leave.findByPk(leaveId);
            if(!leave || (leave && leave.employeeId !=  employeeId)) return res.status(404).json({error:`Leave not found`});

            const currentDate=new Date();
            currentDate.setUTCHours(0,0,0,0)

            if(getDateForDB(leave.dates[leave.dates.length-1]) < currentDate) return res.status(403).json({error:'You cannot update this leave'})
            let leavesDeleted=0;
            const pastDates=[]
            leave.dates.map(leaveDate=>{
                if(getDateForDB(leaveDate) < currentDate){
                    pastDates.push(leaveDate)
                }else leavesDeleted++;
            })
            const {dates,leaveDuration}=await getDatesArray(employeeId,fromDate,toDate,true,{consider:true,leaveId});
            if(employee.leavesLeft - leavesDeleted + leaveDuration > 20) return res.status(403).json({error: 'You do not have enough leaves left'}) ;

            let dateRange=[...pastDates,...dates];

            if(dateRange.length === 0) return res.status(403).json({error:`You cannot update this leaving. Try deleting it and creating a new one`})
        }

        const updatedLeave={
            reason:null,
            dates:null
        }
        if(reason) updatedLeave.reason=reason;
        if(fromDate || toDate) updateLeave.dates=[...dateRange]

        // Updating leaves
        await Leave.update(updatedLeave,{
            where:{
                id:leaveId
            }
        })

        //  Updating leavesLeft for Employee
        await Employee.update({leavesLeft:employee.leavesLeft + leavesDeleted - dates.length},{
            where:{
                id:employeeId
            }
        })

        return res.json({message:'Leave updated successfully'})      
    }catch(e){
        console.log(e)
        return res.status(500).json({error:e.message})
    }   
}

// It is used to delete a specific leave of an employee

export const deleteLeave=async(req,res)=>{
    try{
        const employeeId=req.auth.id;
        const leaveId=Number(req.params.leaveId);

        // Get employee Details
        const employee=await Employee.findByPk(employeeId)

        const leave=await Leave.findByPk(leaveId);
        if(!leave || (leave.employeeId != employeeId)) return res.status(404).json({error:`Leave does not exist`});

        const currentDate=new Date();
        currentDate.setUTCHours(0,0,0,0)

        if(leave.status === 'Under Process'){
            await Leave.destroy({
                where:{id:leaveId}
            })

            return res.json({message:' Leave deleted successfully'})
        }

        if(leave.status === 'rejected' || (leave.status === 'approved' &&  new Date(leave.dates[leave.dates.length-1]).getTime() <= currentDate.getTime())) return res.status(403).json({error:`This leave cannot be deleted`})

        if(getDateForDB(leave.dates[leave.dates.length-1]) < currentDate) return res.status(403).json({error:'You cannot delete this leave as it is of past'})

        const pastDates=[]

        leave.dates.forEach(leaveDate=>{
            if(getDateForDB(leaveDate) < currentDate) pastDates.push(leaveDate)
        })

        if(pastDates.length == 0){
        await Employee.update({leavesLeft:employee.leavesLeft + leave.dates.length},{
            where:{
                id:employeeId
            }
        })

            await Leave.destroy({
                where:{id:leaveId}
            })

        }else{
            await Employee.update({leavesLeft:employee.leavesLeft + (leave.dates.length - pastDates.length)},{
                where:{
                    id:employeeId
                }
            })

            await Leave.update({dates:[...pastDates]},{
                where:{
                    id:leaveId
                }
            })
        }

        
        return res.json({message:' Leave deleted successfully'})

    }catch(e){
        return res.status(500).json({error:e.message})
    }
}

export const deleteLeaveByDate=async(req,res)=>{
    try{
        const employeeId=req.auth.id;
        const dateToDelete=req.params.date;

        if(isValidDate(getDate(dateToDelete))) return res.status(400).json({error:`Please enter a valid date`}); 
        if(isDateInPast(getDate(dateToDelete))) return res.status(403).json({error:`This date is of past. You cannot delete it`}); 

        const [day,month,year]=dateToDelete.split('-');
        const dateForDb=`${year}-${month}-${day}`

        const employee=await Employee.findByPk(employeeId)

        const leave=await Leave.findOne({
            where:{
                employeeId,
                dates:{
                    [Op.contains]:[dateForDb]
                }
            }
        });

        if(!leave) return res.status(404).json({error:`You have not applied for leave on this date`}); 

        if(leave.dates.length === 1){
            await Leave.destroy({
                where:{
                    id:leave.id
                }
            })
            return res.json({message:`Leave deleted successfully`});
        }

        const updatedDates=leave.dates.filter(leaveDate=>{
            if(leaveDate === dateForDb) return false;
            return true
        })

        await Employee.update({leavesLeft:employee.leavesLeft+1},{
            where:{
                id:employeeId
            }
        })

        await Leave.update({dates:[...updatedDates]},{
            where:{
                id:leave.id
            }
        })

        return res.json({message:`Leave deleted successfully`})

    }catch(e){
        console.log(e);
        return res.status(500).json({error:e.message})
    }
}

// It lists all leaves of a signed in user
export const listLeaves=async(req,res)=>{
    try{

        const limit=Number(req.query.limit) || 10
        const offset=Number(req.query.offset) || 1;
        const status = req.query.status;
        const search=req.query.search;

        if(status && (status != 'approved' && status != 'Under Process' && status != "rejected")) return res.status(400).json({error:`Please enter a valid status`})

        if((limit && !offset) || (!limit && offset)) return res.status(400).json({error:'Either limit or offset is necassary'});

        const startIndex = (offset - 1)*limit;

        const employeeId=req.auth.id;

        const whereClause={
            employeeId,
        };

        if(status) whereClause.status=status;

        if(search){
            whereClause[Op.or]=[
                {reason:{[Op.iLike]:`%${search}%`}},
                {status:{[Op.iLike]:`%${search}%`}},
                {rejectionReason:{[Op.iLike]:`%${search}%`}},
                sequelize.where(sequelize.fn('array_to_string', sequelize.col('dates'), ','), { [Op.iLike]: `%${search}%` }),
                sequelize.literal(`CAST ("Leave"."id" AS TEXT) ILIKE '%${search}%'`),
            ]
        }


        const {count,rows:allLeaves}= await Leave.findAndCountAll({
            where:whereClause,
            attributes:{
                exclude:['employeeId','deletedAt']
            },
            offset:startIndex || undefined,
            limit:limit ||undefined
        })


        if(count === 0) return res.status(404).json({error:`There are no leaves in the system`});

        if(limit && offset){
            const totalPages=Math.ceil(count/ limit);

            if(offset > totalPages) return res.status(404).json({error:`This page does not exist`});

            const {totalLeaveDays}=await getTotalLeaveDays(employeeId)

            
            return res.json({data:allLeaves,metadata:{
                totalApplications:count,
                totalLeaveDays,
                currentPage:offset,
                totalPages
            }})
        }
    }catch(e){
        console.log(e)
        return res.status(500).json({error:e.message});
    }
}

// It list the particular leave of a logged in user

export const getLeaveDetails=async(req,res)=>{
    try{
        const employeeId=req.auth.id
        const leaveId=Number(req.params.leaveId);

        const leave=await Leave.findByPk(leaveId,{
            attributes:{
                exclude: ['deletedAt']
            }
        });
        
        if(!leave || leave.employeeId != employeeId) return res.status(404).json({error:`Leave with this id does not exist`})

        return res.json({data:leave})
    }catch(e){
        return res.status(500).json({error:e.message})
    }
}


// It can be used by admin and superadmin
// It is used to fetch leave by leaveId

export const getLeaveById = async (req, res) => {
    try {
        const leaveId = Number(req.params.leaveId);

        const leave = await Leave.findByPk(leaveId,{
            attributes:{
                exclude: ['deletedAt']
            }
        });

        if(!leave) return res.status(404).json({error:`Leave not found`});

        return res.json({data:leave})
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: e.message });
    }
};

export const rejectLeave=async(req,res)=>{
    try{
        const {rejectionReason}=req.body;
        if(!rejectionReason) return res.status(400).json({error:`Please provide the reason for rejecting this leave`})
        const leaveId = Number(req.params.leaveId);

        const leave=await Leave.findByPk(leaveId)

        if(!leave) return res.status(400).json({error:`Leave with this id not found`});

        const employee=await Employee.findByPk(leave.employeeId)
        if(!employee) return res.status(400).json({error:`Employee with this id not found`});
        
        if(req.auth.role === 'admin' && employee.role != 'employee')  return res.status(403).json({error:`You are not authorized to reject this leave`});

        if(req.auth.role === 'superadmin' && employee.role === 'superadmin')  return res.status(403).json({error:`You are not authorized to reject this leave`});

        await Leave.update({status:'rejected',rejectionReason},{
            where:{
                id:leaveId
            }
        })
        return res.json({message:`Leave rejected`})

    }catch(e){
        console.log(e)
        return res.status(500).json({ error: e.message });
    }
}

export const approveLeave=async(req,res)=>{
    try{
        const leaveId = Number(req.params.leaveId);
        const leave=await Leave.findByPk(leaveId);
        if(!leave) return res.status(404).json({error:`Leave with this id not found`});

        const employee=await Employee.findByPk(leave.employeeId);
        
        if(req.auth.role === 'admin' && employee.role != 'employee')  return res.status(403).json({error:`You are not authorized to approve this leave`});

        const currentDate=new Date();
        currentDate.setUTCHours(0,0,0,0);

        if(leave.status === 'approved' || leave.status === 'rejected' || (leave.status === 'Under Process' && currentDate.getTime() > new Date(leave.dates[0]).getTime())) return res.status(400).json({error:`This leave cannot be approved`}) 

        await Leave.update({status:'approved'},{
            where:{
                id:leaveId
            }
        
        })

        const totalLeaveDays=leave.dates.length;

        await Employee.update({leavesLeft:employee.leavesLeft - totalLeaveDays },{
            where:{
                id:leave.employeeId
            }
        })
        return res.json({message:`Leave Approved`});

    }catch(e){
        console.log(e.message)
        return res.status(500).json({ error: e.message });
    }
}

       
   

// It is used to get all leaves in a system

export const getAllLeaves = async (req, res) => {
    try {
        const limit=Number(req.query.limit) || 10;
        const offset=Number(req.query.offset) || 1;
        const status=req.query.status;
        const search=req.query.search;

        if(status && (status != 'approved' && status != 'Under Process' && status != "rejected")) return res.status(400).json({error:`Please enter a valid status`})

        if((limit && !offset) || (!limit && offset)) return res.status(400).json({error:'Either limit or offset is necassary'});

        const startIndex = (offset - 1)*limit;


        const whereClause={};

        if(status) whereClause.status=status;

        if(search){
            whereClause[Op.or]=[
                {reason:{[Op.iLike]:`%${search}%`}},
                {status:{[Op.iLike]:`%${search}%`}},
                {rejectionReason:{[Op.iLike]:`%${search}%`}},
                sequelize.where(sequelize.fn('array_to_string', sequelize.col('dates'), ','), { [Op.iLike]: `%${search}%` }),
                sequelize.literal(`CAST ("Leave"."id" AS TEXT) ILIKE '%${search}%'`),
            ]
        }

        const {count,rows:allLeaves}=await Leave.findAndCountAll({
        where:whereClause,
        offset:startIndex || undefined,
        limit: limit || undefined,
        include:[
            {
                model:Employee,
                attributes:{
                    exclude:['employeeId','hashedPassword','deletedAt']
                }
            }
        ]
       });

       if(count === 0) return res.status(404).json({error:`There are no leaves in the system`})
       let totalLeaves=0;

       allLeaves.forEach(leave=> {
        if(leave.status === 'approved') totalLeaves=totalLeaves+leave.dates.length
       })

       if(limit && offset){
        const totalPages=Math.ceil(count/limit)
        if(offset > totalPages) return res.status(404).json({error:`This page does not exist`})

        return res.json({data:allLeaves,metadata:{
            totalLeaveDays:totalLeaves,
            totalApplications:count,
            currentPage:offset,
            totalPages
        }})
       }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: e.message });
    }
};

export const LeavesSummary=async(req,res)=>{
    try{
        const approvedLeaves = await Leave.count({
            where: {
                status: 'approved',
            },
        });

        const underProcessLeaves = await Leave.count({
            where: {
                status: 'Under Process',
            },
        });

        const rejectedLeaves = await Leave.count({
            where: {
                status: 'rejected',
            },
        });

        return res.json({data:{approvedLeaves,underProcessLeaves,rejectedLeaves}})
    }catch(e){
        console.log(e);
        return res.status(500).json({ error: e.message });  
    }
}

export const EmployeeLeavesSummary=async(req,res)=>{
    try{
        const employeeId=Number(req.params.employeeId)

        if(isNaN(employeeId)) return res.status(400).json({error:`Employee Id should be an integer`})

        const employee=await Employee.findByPk(employeeId);

        if(!employee) return res.status(400).json({error:`Employee with this id does not exist`})

        const approvedLeaves = await Leave.count({
            where: {
                status: 'approved',
                employeeId
            },
        });

        const underProcessLeaves = await Leave.count({
            where: {
                status: 'Under Process',
                employeeId
            },
        });

        const rejectedLeaves = await Leave.count({
            where: {
                status: 'rejected',
                employeeId
            },
        });

        return res.json({data:{approvedLeaves,underProcessLeaves,rejectedLeaves}})
    }catch(e){
        console.log(e);
        return res.status(500).json({ error: e.message });  
    }
}

export const myLeavesSummary=async(req,res)=>{
    try{
        const employeeId=req.auth.id;

        const approvedLeaves = await Leave.count({
            where: {
                status: 'approved',
                employeeId
            },
        });

        const underProcessLeaves = await Leave.count({
            where: {
                status: 'Under Process',
                employeeId
            },
        });

        const rejectedLeaves = await Leave.count({
            where: {
                status: 'rejected',
                employeeId
            },
        });

        return res.json({data:{approvedLeaves,underProcessLeaves,rejectedLeaves}})
    }catch(e){
        console.log(e);
        return res.status(500).json({ error: e.message });  
    }
}



