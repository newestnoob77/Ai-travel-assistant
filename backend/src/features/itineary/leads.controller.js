
import LeadRepository from "./lead.repository.js";
import ApplicationError from "../../middleware/applicationError.middleware.js";
import { buildTravelPrompt } from "../utils/promptBuilder.js";
import { generateTravelItinerary } from "../ai-services/ai.service.js";
export default class LeadController{
    constructor(){
        this.leadRepository = new LeadRepository()
    }

    async genertaeItinerary(req,res,next){
        let  savedLead = null
            try{
            const {name,email,destination,numberOfDays,budget,interest}=req.body;
            // ---Validation---
            if(!name || !email || !destination || !numberOfDays || !budget || !interest) return res.status(400).send("All fields are required")
            //---validating email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
           if (!emailRegex.test(email)) return res.status(400).send("Invalid email format");
           // ---Validation interest to be an array---
            if(!Array.isArray(interest)) return res.status(400).send("Interests should be an array")
            // --- Valiating number of days  so it must be between 1 and 30
           if(numberOfDays<1 || numberOfDays>30) return res.status(400).send("Number of days must be between 1 and 30")
            //Validating budget
            if(budget<=0) return res.status(400).send("Budget must be greater than 0")


                // building ai prompt
                 const prompt   = buildTravelPrompt({name,destination,numberOfDays,budget,interest})
                 //  Generate itinerary using ai
                 const itinerary = await generateTravelItinerary(prompt)
                //  saving the leads to the database
                  savedLead= await this.leadRepository.createLeads({
                    name,email,destination,numberOfDays,budget,interest,generatedItinerary:itinerary,status:"completed"
                 })
                 return res.status(201).json({success:true,message:"Travel itinerary generated successfully",data:{
                    leadId:savedLead._id,
                    itinerary,
                 },
                })
        }catch(err){
            console.log(err)
            if(savedLead && savedLead._id) return await this.leadRepository.updateFailedLead(savedLead._id)
           next(err)
        }

    }
    async getAllLeads(req,res,next){
        try{

            const leads = await this.leadRepository.getAllLeads();
            if(!leads) return res.status(400).send("No leads found")
            return res.status(200).send(leads)
        }
        catch(err){
            console.log(err)
            next(err)
        }
    }

}