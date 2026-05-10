import { useState } from "react";
import { LoadingSpinner } from "./loadingSpinner";
import { generateItinerary } from "../services/api";
export const TravelForm=({setItinerary})=>{
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    destination: "",
    numberOfDays: 1,
    budget: 0, // 
    interest: [],
  });
  const interestsList = [
    "History",
    "Food",
    "Adventure",
    "Shopping",
    "Nature",
    "Beach",
    "Hiking"
  ];
  const handleChange=(e)=>{
    const {name,value}=e.target;
    setFormData((prev)=>({
        ...prev,
        [name]:name==="numberOfDays" || name === "budget"?Number(value):value,
    }));
  };
  const handleInterestChange =(value)=>{
    setFormData((prev)=>{
      const exsist = prev.interest.includes(value);
      return {
        ...prev,
        interest:exsist?
        prev.interest.filter((i)=>i !== value):[...prev.interest,value]
      }
    })
  }
  const handleSubmit = async(e)=>{
    e.preventDefault();
    setLoading(true)
    setError("")
    try{
      const response = await generateItinerary(formData);
      setItinerary(response.data.itinerary);
      setFormData({
        name: "",
        email: "",
        destination: "",
        numberOfDays: 1,
        budget: 0,
        interest: [],
      });
    }catch(err){
      console.log(err)
          setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to generate itinerary"
      );
    }finally{
      setLoading(false)
    }
  }
  if(loading){
    return<LoadingSpinner/>
  }
  return(
    <div className="travel-container">
  <h1 className="title">AI Travel Planner</h1>

  {error && <p className="error">{error}</p>}

  <form className="travel-form" onSubmit={handleSubmit}>
    <div className="input-group">
      <label>Name</label>
      <input
        type="text"
        name="name"
        placeholder="Enter your name"
        value={formData.name}
        onChange={handleChange}
        required
      />
    </div>

    <div className="input-group">
      <label>Email</label>
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        required
      />
    </div>

    <div className="input-group">
      <label>Destination</label>
      <input
        type="text"
        name="destination"
        placeholder="Where do you want to go?"
        value={formData.destination}
        onChange={handleChange}
        required
      />
    </div>

    <div className="two-col">
      <div className="input-group">
        <label>Days</label>
        <input
          type="number"
          name="numberOfDays"
          min="1"
          max="30"
          value={formData.numberOfDays}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-group">
        <label>Budget ($)</label>
        <input
          type="number"
          name="budget"
          min="0"
          value={formData.budget}
          onChange={handleChange}
          required
        />
      </div>
    </div>

    <div className="interests-section">
      <label>Interests</label>
      <div className="interests-grid">
        {interestsList.map((item) => (
          <div
            key={item}
            className={`interest-chip ${
              formData.interest.includes(item) ? "active" : ""
            }`}
            onClick={() => handleInterestChange(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>

    <button className="submit-btn" type="submit">
      Generate Itinerary
    </button>
  </form>
</div>
  )

}