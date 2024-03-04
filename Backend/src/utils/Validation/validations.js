import validator from 'validator';

// Checks if email entered is valid or not

export const isValidEmail=(email)=>{
    try{
        if(!validator.isEmail(email)) return false
        return true;
    }catch(e){
        throw(e.message)
    }
}

// Checks if password entered is valid or not

export const passwordValidation=(password)=>{
    try{
        if(password.length < 4) return true;
        if(validator.isEmpty(password,{ignore_whitespace:true})) return true;
        return false;
    }catch(e){
        throw(e);
    }
}