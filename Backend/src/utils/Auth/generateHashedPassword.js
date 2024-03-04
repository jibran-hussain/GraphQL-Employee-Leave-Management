import bcrypt from 'bcrypt';
import 'dotenv/config'

// Takes input as plain password and generates the hashed password

export const generateHashedPassword=(plainPassword)=>{
    try{
        const hashedPassword = bcrypt.hashSync(plainPassword,Number(process.env.SALT_ROUNDS));
        return hashedPassword;
    }catch(e){
        throw(e)
    }
}