import 'dotenv/config'

export const isSuperAdmin=async(req,res,next)=>{
    try{
        const {role}=req.auth;
        console.log(role,"here is the role")
        if(role != 'superadmin') return res.status(401).json({message:"Unauthorized. Access Denied"})
        next()
    }catch(e){
        return res.status(401).json({error:e.message})
    }
}