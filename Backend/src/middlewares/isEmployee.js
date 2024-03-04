import 'dotenv/config'

export const isEmployee=async(req,res,next)=>{
    try{
        const {role}=req.auth;
        if(role != 'employee') return res.status(401).json({message:"Unauthorized.Access denied"})
        next()
    }catch(e){
        return res.status(401).json({error:e.message})
    }
}