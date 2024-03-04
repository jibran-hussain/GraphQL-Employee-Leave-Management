// checks if the date is valid or not

export const isValidDate=(date)=>{
    if(date instanceof Date || date != 'Invalid Date') return false;
    return true;
}