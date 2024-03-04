import { isAlreadyLeave } from "../leaves/isAlreadyLeave.js";

// Genrates the dates between the range of dates for applying leave excluding the day if it is a weekend or on this day user has already applied for leave

export const getDatesArray= async (userId,fromDate,toDate,leaveConsider,leaveId)=>{
    try{
        let dates=[]
        let leaveDuration=0;

        const startDate=fromDate;
        const endDate=toDate;
        const currentDate=new Date();
        currentDate.setUTCHours(0,0,0)

        while(startDate <= endDate){
            let alreadyApplied=false;
            if(leaveConsider) alreadyApplied= await isAlreadyLeave(userId,startDate,leaveConsider);
            else alreadyApplied= await isAlreadyLeave(userId,startDate,leaveConsider,leaveId);
            
            if (startDate.getDay() === 0 || startDate.getDay() === 6 || alreadyApplied){
                startDate.setDate(startDate.getDate()+1);
                continue;
            }
            
            dates.push(`${startDate.getFullYear()}-${startDate.getMonth()+1 < 10?'0':''}${startDate.getMonth()+1}-${startDate.getDate() < 10?'0':''}${startDate.getDate()}`);
            leaveDuration++;
            startDate.setDate(startDate.getDate()+1);
        }
        return {dates,leaveDuration}
        
    }catch(e){
        console.log(e)
    }
}