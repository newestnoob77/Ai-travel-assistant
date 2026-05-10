import axios from "axios";
const API = axios.create({baseURL:process.env.API_URL});
export const generateItinerary=async(formData)=>{
    const response =await API.post('/leads/generate',formData);
    return response.data;
}
export const getAllleads=async ()=>{
    const response = await API.get("/leads")
    return response.data
}
export const getAllLeads=async()=> await API.get("/leads")