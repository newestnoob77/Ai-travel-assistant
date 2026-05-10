import axios from "axios";
const API = axios.create({baseURL:"http://localhost:4000/api"});
export const generateItinerary=async(formData)=>{
    const response =await API.post('/leads/generate',formData);
    return response.data;
}
export const getAllleads=async ()=>{
    return await API.get("/leads")
}
