import { RESPONSE_MESSAGES, STATUS_CODES } from "../constants";
const response = (res) => {
    global.errorResponse = (message, statusCode = STATUS_CODES.SERVER_ERROR) => {
        let responseMessage = message ? message : RESPONSE_MESSAGES.SERVER_ERROR;
        let responseCode = (statusCode && !isNaN(statusCode)) ? statusCode : STATUS_CODES.SERVER_ERROR;
        const resObj = {
            code: responseCode,
            message: responseMessage,
            error: true,
        };
        return res.status(responseCode).json(resObj);
    };

    global.successResponse = (message, data, statusCode = STATUS_CODES.SUCCESS) => {
        let responseMessage = RESPONSE_MESSAGES.DEFAULT_SUCCESS_MESSAGE;
        let responseCode = STATUS_CODES.SUCCESS;
        if(statusCode && !isNaN(statusCode)){
            if(message){
                responseMessage = message;
            }
            responseCode = statusCode;
        }
        const resObj = {
            code: responseCode,
            message: responseMessage,
            data
        };
        return res.status(responseCode).json(resObj);
    };
};

export default response;