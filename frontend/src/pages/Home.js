import { useState } from "react";
import { TravelForm } from "../components/TravelForm";
import {ItineraryDisplay} from "../components/ItineraryDisplay";
export const Home=()=>{
    const [itinerary,setItinerary]=useState("")
    return(
         <div>

      {
        itinerary
        ? (
          <ItineraryDisplay
            itinerary={itinerary}
            reset={() =>
              setItinerary("")
            }
          />
        )
        : (
          <TravelForm
            setItinerary={
              setItinerary
            }
          />
        )
      }

    </div>
    );
};