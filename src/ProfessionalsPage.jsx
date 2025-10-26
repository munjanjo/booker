import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBooking } from "./BookingContext.jsx";
import { apiFetch } from "./lib/api";
import "./professionals.css";

export default function ProfessionalsPage() {
  const { salonId } = useParams();
  const navigate = useNavigate();
  const {
    selectedServices,
    selectedProfessional,
    setSelectedProfessional,
    selectedDateTime,
    setSelectedDateTime,
    resetBooking,
  } = useBooking();

  const professionals = useMemo(
    () => [
      { id: "pro-1", name: "Ana" },
      { id: "pro-2", name: "Marko" },
    ],
    []
  );

  const [loading, setLoading] = useState(false);

  if (!selectedServices?.length) {
    return <p>Nema odabranih usluga. Vratite se na salon.</p>;
  }

  const submitBooking = async () => {
    if (!selectedDateTime) return alert("Odaberite datum i vrijeme.");

    setLoading(true);
    try {
      const allServices = await apiFetch("/api/services");

      const firstSelectedName = selectedServices[0]?.name
        ?.toString()
        .trim()
        .toLowerCase();
      const matched = allServices.find(
        (s) => s.name?.toString().trim().toLowerCase() === firstSelectedName
      );

      if (!matched) {
        alert(
          "Odabrana usluga ne postoji na serveru. Osvježite stranicu i pokušajte ponovno."
        );
        return;
      }

      const isoStart = new Date(selectedDateTime).toISOString();

      const body = {
        serviceId: matched.id,
        startUtc: isoStart,
      };

      await apiFetch("/api/appointments", { method: "POST", auth: true, body });
      alert("Rezervacija uspješna!");
      resetBooking();
      navigate("/my-appointments");
    } catch (e) {
      alert("Greška: " + (e.details?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="professionals-container">
      <h2>Usluge: {selectedServices.map((s) => s.name).join(", ")}</h2>

      <div style={{ margin: "16px 0" }}>
        <h3>Odaberi profesionalca (opcionalno)</h3>
        {professionals.map((p) => (
          <label key={p.id} style={{ display: "block", cursor: "pointer" }}>
            <input
              type="radio"
              name="pro"
              checked={selectedProfessional?.id === p.id}
              onChange={() => setSelectedProfessional(p)}
            />{" "}
            {p.name}
          </label>
        ))}
      </div>

      <div style={{ margin: "16px 0" }}>
        <h3>Datum i vrijeme</h3>
        <input
          type="datetime-local"
          value={selectedDateTime ?? ""}
          onChange={(e) => setSelectedDateTime(e.target.value)}
        />
      </div>

      <button
        className="book-button"
        disabled={loading}
        onClick={submitBooking}
      >
        {loading ? "Spremam..." : "Potvrdi rezervaciju"}
      </button>
    </div>
  );
}
