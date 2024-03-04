import Leave from "../../models/leaves.js";

const getTotalLeaveDays=async(employeeId)=>{
    try{
       const allLeaves= await Leave.findAll({
            where:{
                employeeId,
                status:'approved'
            }
        })
        
        const {count:timesApplied}= await Leave.findAndCountAll({
            where:{
                employeeId,
            }
        })

        let totalLeaveDays=0;
        allLeaves.forEach(leave=>totalLeaveDays=totalLeaveDays+leave.dates.length)

        return {totalLeaveDays,timesApplied};

    }catch(e){
        throw(e);
    }
}

export default getTotalLeaveDays;