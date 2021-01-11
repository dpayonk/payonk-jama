

class Logger{
    // Simple Logger class to centralize console.log for debugging
    constructor(){
        console.log("Use Static Functions please");
    }
}

Logger.info = function(message, obj){
    if(obj !== undefined){
        console.log(message, obj)
    } else {
        console.log(message);
    }
}

Logger.output = 'console';

Logger.error = function(message, exc){
    console.error(message, exc);
}

Logger.redirectTo = function(arr){
    Logger.output = arr;
}


export default Logger