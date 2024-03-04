// Checks if a mobile number is valid or not

export const isValidNumber=(mobileNumber)=>{
    if(!Number(mobileNumber) || mobileNumber.toString().length != 10) return false;
    return true;
}