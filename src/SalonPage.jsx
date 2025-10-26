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

  const [services, setServices] = useState([]); // uvijek niz
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Normaliziraj sve moguće oblike odgovora u jedinstveni niz
  const normalizeServices = (raw) => {
    const mapOne = (x, idx) => ({
      id: x?.id ?? x?.serviceId ?? idx,
      name: x?.name ?? x?.serviceName ?? "Usluga",
      durationMinutes: Number(x?.durationMinutes ?? x?.duration ?? 0),
      price: Number(x?.price ?? x?.cost ?? 0),
    });

    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map(mapOne);
    if (Array.isArray(raw.items)) return raw.items.map(mapOne);
    if (Array.isArray(raw.data)) return raw.data.map(mapOne);
    if (Array.isArray(raw.results)) return raw.results.map(mapOne);
    if (raw.id || raw.name) return [mapOne(raw, 0)];
    return [];
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");

        // Ako imaš endpoint po salonu, koristi: `/api/salons/${salonId}/services`
        const data = await apiFetch("/api/services");
        const list = normalizeServices(data);

        if (alive) setServices(list);
      } catch (e) {
        if (alive) {
          setError(e?.message ?? "Greška pri dohvaćanju usluga.");
          setServices([]); // ostani na nizu da .map nikad ne pukne
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [salonId]);

  const addService = (svc) => {
    const cleaned = {
      id: svc.id,
      name: svc.name,
      durationMinutes: Number(svc.durationMinutes) || 0,
      price: Number(svc.price) || 0,
    };
    setSelectedServices((prev) =>
      prev.find((s) => s.id === cleaned.id) ? prev : [...prev, cleaned]
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

          {loading ? (
            <div className="skeleton-list">
              <div className="skeleton-card" />
              <div className="skeleton-card" />
              <div className="skeleton-card" />
            </div>
          ) : error ? (
            <div className="error-box">
              <p>{error}</p>
              <button className="btn" onClick={() => window.location.reload()}>
                Pokušaj ponovno
              </button>
            </div>
          ) : (
            <div className="service-list">
              {Array.isArray(services) && services.length > 0 ? (
                services.map((s) => (
                  <div className="service-card" key={s.id}>
                    <div className="service-name">{s.name}</div>
                    <div className="service-duration">
                      {s.durationMinutes} min
                    </div>
                    <div className="service-description"></div>
                    <div className="service-footer">
                      <div className="service-price">
                        €{Number.isFinite(s.price) ? s.price : 0}
                      </div>
                      <button
                        className="book-button"
                        onClick={() => addService(s)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">Nema dostupnih usluga.</div>
              )}
            </div>
          )}
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
                    {s.name} €{Number(s.price) || 0}
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
