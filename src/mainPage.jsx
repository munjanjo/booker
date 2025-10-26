import { useNavigate } from "react-router-dom";
import salons from "./salons";
import "./mainPage.css";
import Navbar from "./Navbar.jsx";

export default function MainPage() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="salons-container">
        <div className="salon-list">
          {salons.map((salon) => (
            <div
              key={salon.id}
              className="salon-card"
              onClick={() => navigate(`/salon/${salon.id}`)}
            >
              <img src={salon.logo} alt={salon.name} className="salon-logo" />
              <h2>{salon.name}</h2>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
