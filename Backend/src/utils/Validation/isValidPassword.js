import bcrypt from 'bcrypt';

// Checks if a password entered is correct or not

export const isValidPassword=(plainPassword,hash)=>{
    try{
        const isValid=bcrypt.compareSync(plainPassword,hash);
        if(!isValid) return false;
        return true;
    }catch(e){
        throw(e);
    }
}