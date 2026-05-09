import { leadsModel } from "./leadsModel.js";
export default class LeadRepository {
    async createLeads(leadsDetail){
        return  await new leadsModel(leadsDetail).save()
    }
    async getAllLeads(){
        return await leadsModel.find().sort({createdAt:-1})
    }
    async updateFailedLead(id){
        return await leadsModel.findByIdAndUpdate(id,{status:"failed"},{returnDocument:"after"})
    }
}