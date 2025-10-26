import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "./lib/api";
import "./my-appointments.css";
import Navbar from "./Navbar";

export default function MyAppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [cancelingIds, setCancelingIds] = useState(() => new Set());

  const dtf = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/api/appointments/mine", { auth: true });

        // Normalizacija – obavezno osiguraj da svaki zapis ima `id`
        const normalized = (Array.isArray(data) ? data : []).map((x, idx) => ({
          id: x.id ?? x.appointmentId ?? x.appId ?? idx, // fallback samo za debug
          serviceId: x.serviceId,
          serviceName: x.serviceName ?? "Usluga",
          startUtc: x.startUtc,
          endUtc: x.endUtc,
          status: x.status ?? "Booked",
          professionalName: x.professionalName ?? "—",
          salonName: x.salonName ?? "—",
          price: typeof x.price === "number" ? x.price : undefined,
        }));

        if (mounted) setAppointments(normalized);
      } catch (e) {
        if (mounted) setErr(e.message ?? "Greška pri dohvaćanju rezervacija.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const goToBooking = () => navigate("/main");

  // 👉 Otkazivanje termina
  const setCanceling = (id, on) => {
    setCancelingIds((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleCancel = async (a) => {
    const id = a?.id;
    if (id == null) {
      alert("Nije moguće otkazati ovaj termin jer nedostaje ID.");
      return;
    }
    if (!window.confirm("Želiš li sigurno otkazati ovaj termin?")) return;

    try {
      setCanceling(id, true);

      // Pozovi backend otkazivanja
      await apiFetch(`/api/appointments/${id}/cancel`, {
        method: "POST",
        auth: true,
      });

      // Optimistički ažuriraj UI (status -> Cancelled)
      setAppointments((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status: "Cancelled" } : x))
      );
    } catch (e) {
      setErr(e.message ?? "Neuspješno otkazivanje termina.");
    } finally {
      setCanceling(id, false);
    }
  };

  if (loading) {
    return (
      <div className="myapp-page">
        <h2>Moje rezervacije</h2>
        <div className="skeleton-list">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="myapp-page">
        <Navbar />
        <h2>Moje rezervacije</h2>
        <div className="error-box">
          <p>{err}</p>
          <button className="btn" onClick={() => window.location.reload()}>
            Pokušaj ponovno
          </button>
        </div>
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div className="myapp-page">
        <h2>Moje rezervacije</h2>
        <div className="empty-state">
          <p>Još nemaš rezervacija.</p>
          <button className="btn" onClick={goToBooking}>
            Rezerviraj termin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="myapp-page">
      <Navbar />
      <h2>Moje rezervacije</h2>

      <div className="cards">
        {appointments.map((a) => {
          const start = a.startUtc ? new Date(a.startUtc) : null;
          const end = a.endUtc ? new Date(a.endUtc) : null;
          const status = (a.status ?? "Booked").toLowerCase();

          const canCancel = status !== "cancelled" && status !== "completed";
          const busy = a.id != null && cancelingIds.has(a.id);

          return (
            <article
              className="card"
              key={a.id ?? `${a.serviceId}-${a.startUtc}`}
            >
              <header className="card-header">
                <h3 className="service">{a.serviceName}</h3>
                <span
                  className={`badge ${
                    status === "cancelled"
                      ? "badge-danger"
                      : status === "completed"
                      ? "badge-muted"
                      : "badge-ok"
                  }`}
                >
                  {a.status ?? "Booked"}
                </span>
              </header>

              <div className="card-body">
                <div className="row">
                  <span className="label">Početak</span>
                  <span className="value">
                    {start ? dtf.format(start) : "-"}
                  </span>
                </div>
                <div className="row">
                  <span className="label">Kraj</span>
                  <span className="value">{end ? dtf.format(end) : "-"}</span>
                </div>
                <div className="row">
                  <span className="label">Profesionalac</span>
                  <span className="value">{a.professionalName}</span>
                </div>
                <div className="row">
                  <span className="label">Salon</span>
                  <span className="value">{a.salonName}</span>
                </div>
                {typeof a.price === "number" && (
                  <div className="row">
                    <span className="label">Cijena</span>
                    <span className="value">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "EUR",
                      }).format(a.price)}
                    </span>
                  </div>
                )}
              </div>

              <footer className="card-footer">
                <button className="btn ghost" onClick={goToBooking}>
                  Novi termin
                </button>

                {canCancel && (
                  <button
                    className="btn danger"
                    disabled={busy}
                    onClick={() => handleCancel(a)}
                    title="Otkaži ovaj termin"
                  >
                    {busy ? "Otkazujem..." : "Otkaži"}
                  </button>
                )}
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
}
