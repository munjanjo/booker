import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./mainPage.css";
import { useBooking } from "./BookingContext.jsx";
import { apiFetch } from "./lib/api";

export default function SalonPage() {
  const { salonId } = useParams();
  const navigate = useNavigate();
  const { selectedServices, setSelectedServices, setSelectedSalon } =
    useBooking();

  const [services, setServices] = useState([]);

  useEffect(() => {
    apiFetch("/api/services")
      .then(setServices)
      .catch((e) => alert("Greška pri dohvaćanju usluga: " + e.message));
  }, []);

  const addService = (svc) => {
    // spriječi duplikate po ID-u
    setSelectedServices((prev) =>
      prev.find((s) => s.id === svc.id) ? prev : [...prev, svc]
    );
  };

  const totalPrice = selectedServices.reduce(
    (sum, s) => sum + (Number(s.price) || 0),
    0
  );

  return (
    <div className="booking-page">
      <Navbar />
      <div className="booking-wrapper">
        <div className="service-section">
          <h1 className="service-title">Services</h1>
          <ul className="service-list">
            {services.map((s) => (
              <div className="service-card" key={s.id}>
                <div className="service-name">{s.name}</div>
                <div className="service-duration">{s.durationMinutes} min</div>
                <div className="service-description"></div>
                <div className="service-footer">
                  <div className="service-price">€{s.price}</div>
                  <button className="book-button" onClick={() => addService(s)}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </ul>
        </div>

        <div className="summary-box">
          <div className="summary-header">
            <div>
              <strong>Selected salon: {salonId}</strong>
            </div>
          </div>

          <div className="summary-content">
            {selectedServices.length === 0 ? (
              <p>No services selected</p>
            ) : (
              selectedServices.map((s) => (
                <div className="summary-item" key={s.id}>
                  <span>
                    {s.name} €{s.price}
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
              style={{ width: "100%", marginTop: 10 }}
              onClick={() => {
                if (selectedServices.length === 0) {
                  alert("Please select at least one service");
                } else {
                  setSelectedSalon(salonId);
                  navigate(`/professionals/${salonId}`);
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
