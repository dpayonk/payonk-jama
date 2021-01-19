

class Logger{
    // Simple Logger class to centralize console.log for debugging
    constructor(){
        console.log("Use Static Functions please");
    }
}

Logger.output = 'console';


Logger.debug = function(message, obj){
    if(obj !== undefined){
        console.debug(message, obj)
    } else {
        console.debug(message);
    }
    Logger.publishEvent('debug',{message: message, obj: obj});
}

Logger.info = function(message, obj){
    if(obj !== undefined){
        console.log(message, obj)
    } else {
        console.log(message);
    }
    Logger.publishEvent('info',{message: message, obj: obj});
}

/* Dangerous because of infinite loop */
Logger.warn = function(message, obj){
    if(obj !== undefined){
        console.warn(message, obj)
    } else {
        console.warn(message);
    }
    Logger.publishEvent('warn',{message: message, obj: obj});
}

Logger.error = function(message, exc){
    console.error(message, exc);
}

Logger.redirectTo = function(arr){
    Logger.output = arr;
}

Logger.subscribe = function (eventKey, callback) {
    Logger.SUBSCRIBERS = Logger.SUBSCRIBERS || {};

    if (Logger.SUBSCRIBERS[eventKey] !== undefined) {
        Logger.SUBSCRIBERS[eventKey].push(callback);
    } else {
        Logger.SUBSCRIBERS[eventKey] = [];
        Logger.SUBSCRIBERS[eventKey].push(callback);
    }
    console.log(`Registered Logger.${eventKey} subscriber:`, callback);
}

Logger.publishEvent = function (eventKey, props) {

    if (Logger.SUBSCRIBERS === undefined) {
       console.log(`Initializing Logging subscribers`);
       Logger.SUBSCRIBERS = Logger.SUBSCRIBERS || {};
    }

    if (Logger.SUBSCRIBERS[eventKey] !== undefined) {
        Logger.SUBSCRIBERS[eventKey].forEach(function (callbackFunction, index) {
            try {
                let result = callbackFunction(props);
                Logger.info('Completed publish callback', result);
            } catch (error) {
                Logger.error(`A subscriber to user updates failed:`, error);
            }
        });
    } else {
        Logger.SUBSCRIBERS[eventKey] = [];
    }
    return Logger.SUBSCRIBERS[eventKey].length;
}


export default Logger