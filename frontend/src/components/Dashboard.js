import { useEffect, useState }from "react";
import { getAllleads } from "../services/api";
import { ItineraryDisplay } from "./ItineraryDisplay";
export const Dashboard=()=>{
   const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);

  // Fetch leads when component mounts
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await getAllleads();
        setLeads(response.data); // assuming backend returns an array of leads
      } catch (err) {
        console.error("Failed to fetch leads:", err);
      }
    };

    fetchLeads();
  }, []);

  const resetSelection = () => setSelectedLead(null);

  if (selectedLead) {
    return (
      <ItineraryDisplay
        itinerary={selectedLead.generatedItinerary}
        reset={resetSelection}
      />
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="leads-grid">
        {leads.map((lead) => (
          <div
            key={lead._id}
            className="lead-card"
            onClick={() => setSelectedLead(lead)}
          >
            <h3 className="lead-name">{lead.name}</h3>
            <p className="lead-email">{lead.email}</p>
            <p className="lead-destination">{lead.destination}</p>
          </div>
        ))}
      </div>
    </div>
  );
}