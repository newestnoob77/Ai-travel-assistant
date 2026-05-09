import ApplicationError from "./applicationError.middleware.js";
export const errorHandler=(err,req,res,next)=>{
    console.log(err)
    if(err instanceof ApplicationError){
        return res.status(err.statusCode || 500).json({
            success:false,
            message:err.message
        });
    }
    if (err instanceof mongoose.Error.ValidationError){
        return res.status(400).json({
            success:false,
            messgae:err.message
        })
    }
    return res.status(500).json({
        success:false,
        message:"Internal Server error"
    })
}