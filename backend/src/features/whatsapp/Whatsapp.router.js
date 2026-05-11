import express from "express"
import WhatsappController from "./Whatsapp.controller.js"
const whatsappController = new WhatsappController()
export const whatsappRouter = express.Router()
whatsappRouter.post("/webhook",(req,res,next)=>{
    whatsappController.handleWhatsAppMessage(req,res,next)
})
