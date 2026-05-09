export default class ApplicationError extends Error{
    constructor(statusCode,message){
        super(message);
        this.statusCode =statusCode;
        Error.captureStackTrace(this,this.constructor)
    }
}