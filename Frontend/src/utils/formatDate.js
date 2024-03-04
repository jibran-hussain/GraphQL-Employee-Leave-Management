const formatDate=(dateString)=>{
    const selectedDate = new Date(dateString);
    const day = selectedDate.getDate().toString().padStart(2,0);
    const month = (selectedDate.getMonth()+1).toString().padStart(2,0);
    const year = selectedDate.getFullYear();
    return `${day}-${month}-${year}`
}

export default formatDate;