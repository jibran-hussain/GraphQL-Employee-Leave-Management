import Leave from "../../models/leaves.js"

export const getTotalApplicationsInSystem=async()=>{
    try{
        const {count}=await Leave.findAndCountAll();
        return count;
    }catch(e){
        throw(e);
    }
}

export const getTotalLeaveDaysInSystem=async()=>{
    try{
        let totalLeaveDays=0;
        const allLeaves=await Leave.findAll();
        allLeaves.forEach(leave=>totalLeaveDays=totalLeaveDays+leave.dates.length)
        console.log(totalLeaveDays,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        return totalLeaveDays;
    }catch(e){
        throw(e);
    }
}