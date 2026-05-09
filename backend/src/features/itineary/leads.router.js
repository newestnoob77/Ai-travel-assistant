import express from "express"
import LeadController from "./leads.controller.js"
const leadController = new LeadController()
export const leadRouter = express.Router()
leadRouter.post("/generate",(req,res,next)=>{
    leadController.genertaeItinerary(req,res,next)
})
leadRouter.get("/",(req,res,next)=>{
    leadController.getAllLeads(req,res,next)
})