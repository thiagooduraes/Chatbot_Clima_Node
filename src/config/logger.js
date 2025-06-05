import winston from "winston";

const {combine, timestamp, json, printf, errors} = winston.format;

const stringifyMetadata = (metadata) => {
    const {level, message, timestamp: ts, stack, ...rest} = metadata;
    
    if (Object.keys(rest).length === 0) {
        return '';
    }

    try{
        return `, "metadata": ${JSON.stringify(rest)}`;
    } catch (e) {
        return ', "metadata": "[Error parsing metadata]"';
    }
};

const fileJsonFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {

    let logMessage = `{`;

    logMessage += `"timestamp": "${timestamp}"`;

    logMessage += `, "level": "${level}"`;

    logMessage += `, "message": "${message}"`;

    if (stack) {
        logMessage += `, "stack": "${JSON.stringify(stack)}"`;
    }

    logMessage += stringifyMetadata({...metadata});
    
    logMessage += `}`;

    return logMessage;
});

const logger = winston.createLogger({

    level: process.env.LOG_LEVEL || 'info',

    format: combine(
        timestamp(),
        errors({ stack: true }),
    ),

    transports: [

        new winston.transports.File({ 
            filename: 'chatbot.log', 
            format: fileJsonFormat,
            level: 'info'
        })
    ]
});

export { logger };