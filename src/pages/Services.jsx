import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addBooking } from "../features/admin/adminSlice";
import { useToast } from "../components/common/Toast";

export default function Services() {
  const SERVICES = useSelector((s) => s.services.services);
  const PACKAGES = useSelector((s) => s.services.packages).map((p) => ({
    ...p,
    items: typeof p.items === "string" ? p.items.split(",").map((s) => s.trim()) : p.items,
  }));
  const [booking, setBooking] = useState(null);
  const [form, setForm] = useState({ vehicle: "", date: "", time: "" });
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const submit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast?.("Please log in to book a service", "error");
      navigate("/login");
      return;
    }
    dispatch(addBooking({
      type: "Service",
      customer: user?.name || "Customer",
      customerEmail: user?.email || "",
      car: `${booking.name} — ${form.vehicle}`,
      date: form.date,
      time: form.time,
      status: "Pending",
    }));
    toast?.(`${booking.name} booked — status: Pending confirmation`, "success");
    setBooking(null);
    setForm({ vehicle: "", date: "", time: "" });
  };

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Aftercare</span>
              <h1 className="fs-h1">Individual services</h1>
            </div>
          </div>
          <div className="grid grid-3">
            {SERVICES.map((s, i) => (
              <motion.div
                className="card service-card"
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="flex-between">
                  <h3>{s.name}</h3>
                  <span className="mono">${s.price}</span>
                </div>
                <span className="text-muted mono" style={{ fontSize: "var(--fs-xs)" }}>Est. {s.duration}</span>
                <button className="btn btn-ghost btn-sm btn-block" style={{ marginTop: 16 }} onClick={() => setBooking(s)}>
                  Book Service
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section services-section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Bundled &amp; discounted</span>
              <h2>Service packages</h2>
            </div>
          </div>
          <div className="grid grid-3">
            {PACKAGES.map((p) => (
              <div className="card package-card" key={p.id}>
                <h3>{p.name}</h3>
                <span className="mono package-price">${p.price}</span>
                <ul className="feature-list">
                  {p.items.map((item) => <li key={item}><span className="feature-dot" />{item}</li>)}
                </ul>
                <button className="btn btn-primary btn-sm btn-block" onClick={() => setBooking({ name: p.name, price: p.price })}>
                  Choose Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {booking && (
        <div className="modal-overlay" onClick={() => setBooking(null)}>
          <motion.div
            className="modal card"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
          >
            <div className="flex-between">
              <h3>Book {booking.name}</h3>
              <button className="icon-btn" onClick={() => setBooking(null)} aria-label="Close">✕</button>
            </div>
            <form onSubmit={submit} style={{ marginTop: 16 }}>
              <div className="field">
                <label htmlFor="sv-vehicle">Vehicle (make, model, plate)</label>
                <input id="sv-vehicle" required placeholder="Aster Meridian GT · ABC-123" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} />
              </div>
              <div className="grid grid-2">
                <div className="field">
                  <label htmlFor="sv-date">Preferred Date</label>
                  <input id="sv-date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="field">
                  <label htmlFor="sv-time">Preferred Time</label>
                  <input id="sv-time" type="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Confirm Booking</button>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}
