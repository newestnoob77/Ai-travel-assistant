export const ItineraryDisplay = ({ itinerary, reset }) => {
  return (
    <div className="itinerary-container">
      <h1 className="itinerary-title">Your Travel Itinerary</h1>

      <div className="itinerary-box">
        {itinerary
          .split("\n")
          .map((line, index) => {
            if (line.startsWith("###")) {
              return (
                <h2 key={index} className="day-title">
                  {line.replace("###", "").trim()}
                </h2>
              );
            } else if (line.startsWith("**")) {
              return (
                <p key={index} className="highlight">
                  {line.replace(/\*\*/g, "").trim()}
                </p>
              );
            } else {
              return (
                <p key={index} className="itinerary-text">
                  {line}
                </p>
              );
            }
          })}
      </div>

      <button className="reset-btn" onClick={reset}>
        Plan Another Trip
      </button>
    </div>
  );
};
