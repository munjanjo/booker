import { Navigate, useNavigate, useParams } from "react-router-dom";
import salons from "./salons";
import "./mainPage.css";
import Navbar from "./Navbar";
import { useState } from "react";

export default function SalonPage() {
  const { salonId } = useParams();
  const salon = salons.find(
    (s) => s.id.toLowerCase() === salonId.toLowerCase()
  );
  const [selectedServices, setSelectedServices] = useState([]);

  const addService = (service) => {
    setSelectedServices((prev) => [...prev, service]);
  };

  // izračun cijene iz formata "€20"
  const totalPrice = selectedServices.reduce((sum, service) => {
    const numericPrice = parseFloat(service.price.replace(/[^\d.]/g, ""));
    return sum + (isNaN(numericPrice) ? 0 : numericPrice);
  }, 0);

  if (!salon) return <h2>Salon nije pronađen</h2>;
  const navigate = useNavigate();
  return (
    <div className="booking-page">
      <Navbar />
      <div className="booking-wrapper">
        <div className="service-section">
          <h1 className="service-title">Services</h1>
          <ul className="service-list">
            {salon.services.map((service, index) => (
              <div className="service-card" key={index}>
                <div className="service-name">{service.name}</div>
                <div className="service-duration">{service.duration}</div>
                <div className="service-description">{service.description}</div>
                <div className="service-footer">
                  <div className="service-price">{service.price}</div>
                  <button
                    className="book-button"
                    onClick={() => addService(service)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </ul>
        </div>

        <div className="summary-box">
          <div className="summary-header">
            <img src={salon.logo} alt={salon.name} className="summary-logo" />
            <div>
              <strong>{salon.name}</strong>
              <div className="summary-location">{salon.location}</div>
            </div>
          </div>
          <div className="summary-content">
            {selectedServices.length === 0 ? (
              <p>No services selected</p>
            ) : (
              selectedServices.map((service, index) => (
                <div className="summary-item" key={index}>
                  <span>
                    {service.name} {service.price}
                  </span>
                </div>
              ))
            )}
            <hr />
            <div className="summary-total">
              <span>Total</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
            <button
              className="book-button"
              style={{ width: "100%", marginTop: "10px" }}
              onClick={() => {
                if (selectedServices.length === 0) {
                  alert("Please select at least one service");
                } else {
                  navigate(`/professionals/${salon.id}`);
                }
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
