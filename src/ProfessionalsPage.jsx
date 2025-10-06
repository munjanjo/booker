import { useParams } from "react-router-dom";
import salons from "./salons.js";
import "./professionals.css";

export default function ProfessionalsPage() {
  const { salonId } = useParams();

  const salon = salons.find(
    (s) => s.id.toLowerCase() === salonId.toLowerCase()
  );

  if (!salon) return <h2>Salon not found</h2>;

  return (
    <>
      <h1>Select professional</h1>
      <div className="professionals-container">
        <div className="professionals-grid">
          {salon.professionals.map((pro) => (
            <div key={pro.id} className="professional-card">
              <img src={pro.photo} />
              <h3>{pro.name}</h3>
              <p className="professional-role">{pro.role}</p>
              <p className="professional-salon">{salon.name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
