import dotenv from "dotenv";
dotenv.config()
import express from "express";
import cors from "cors"
import ApplicationError from "./src/middleware/applicationError.middleware.js";
import { connectMongoose } from "./src/config/config.js";
import { errorHandler } from "./src/middleware/errorHandlerMiddleware.js";
import { leadRouter } from "./src/features/itineary/leads.router.js";
import { whatsappRouter } from "./src/features/whatsapp/Whatsapp.router.js";
const server = express()
server.use(express.json())
server.use(express.urlencoded({extended:true}))
server.use(errorHandler)
server.use(cors({
    origin:"http://localhost:3000",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))
server.use("/api/leads",leadRouter)
server.use("/api/whatsapp",whatsappRouter)
server.listen(process.env.PORT || 3000,()=>{
    console.log(`Server is listening ${process.env.PORT}`)
    connectMongoose()
})