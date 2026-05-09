export const buildTravelPrompt=(travelDetails)=>{
    console.log(`travel details: ${travelDetails}`)
    return `
You are an expert travel planner.

Create a detailed ${travelDetails.numberOfDays}-day travel itinerary for ${travelDetails.name}.

Destination: ${travelDetails.destination}
Budget: ${travelDetails.budget} USD
Interests: ${travelDetails.interest.join(", ")}

Requirements:
- Day by day breakdown
- Morning, afternoon, evening plans
- Food recommendations
- Estimated costs
- Practical travel tips
- Budget friendly suggestions

Format the response clearly.
`;
};