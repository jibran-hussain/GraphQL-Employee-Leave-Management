import { Op } from 'sequelize';
import { getDateForDB } from '../Date/getDate.js';
import Leave from '../../models/leaves.js';

// Checks if the employee is already on leave on a particular date or not

export const isAlreadyLeave=async(employeeId,date,leaveConsider,leaveId)=>{
    try{
        const allLeaves= await Leave.findAll({
            where:{
                employeeId,
                status:{
                    [Op.not]:'rejected'
                }
            }
        })
        let isAlreadyLeave=false;
        if(leaveConsider){
            allLeaves.forEach(leave=>{
                leave.dates.forEach(leaveDate=>{
                    if(getDateForDB(leaveDate).getTime() === date.getTime()) isAlreadyLeave=true;
                })
        })
        }else{
            allLeaves.forEach(leave=>{
                if(leave.id != leaveId){
                    leave.dates.forEach(leaveDate=>{
                        if(getDateForDB(leaveDate).getTime() === date.getTime()) isAlreadyLeave=true;
                    })
                }
        })
        }

        return isAlreadyLeave;
    }catch(e){
        console.log(e);
    }
}