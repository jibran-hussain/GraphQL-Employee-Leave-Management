import 'dotenv/config'

export const isAdmin=async(req,res,next)=>{
    try{
        const {role}=req.auth;
        if(role != 'admin') return res.status(401).json({message:"Unauthorized"})
        next()
    }catch(e){
        return res.status(401).json({error:e.message})
    }
}