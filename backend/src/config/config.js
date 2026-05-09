import mongoose from "mongoose";
 export  const connectMongoose=async()=>{
    try{
await mongoose.connect(process.env.DB_URL)
console.log("Mongodb connected")
    }
    catch(err){
        console.log(err)
    }
 }