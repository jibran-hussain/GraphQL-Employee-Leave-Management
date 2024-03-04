const debounce=(func,waitTime)=>{
    let timerId=null;
    return function(){
        clearTimeout(timerId)
        timerId=setTimeout(()=>{
            func(...arguments);
        },waitTime)
    }
}

export default debounce;