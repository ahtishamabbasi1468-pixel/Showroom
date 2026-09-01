import { useState } from "react";
import { useToast } from "../components/common/Toast";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    toast?.("Message sent — we'll reply within one business day.", "success");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Get in touch</span>
            <h1 className="fs-h1">Visit or write to us</h1>
          </div>
        </div>

        <div className="contact-layout">
          <div className="card contact-map">
            <iframe
              title="Ignis Motors Showroom Location — Rawalpindi"
              src="https://www.google.com/maps?q=Rawalpindi,+Punjab,+Pakistan&output=embed"
              width="100%"
              height="320"
              style={{ border: 0, borderRadius: "var(--radius-md, 12px)" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="contact-details">
              <div><strong>Address</strong><p className="text-muted">221 Ravel Motorway, Rawalpindi, Punjab</p></div>
              <div><strong>Phone</strong><p className="text-muted mono">+92 3110506636</p></div>
              <div><strong>Email</strong><p className="text-muted mono">Ahtisham@ignismotors.com</p></div>
              <div><strong>Hours</strong><p className="text-muted">Mon–Sat · 9:00 AM – 8:00 PM</p></div>
            </div>
          </div>

          <div className="card contact-form-panel">
            <h3>Send a message</h3>
            {sent && <div className="badge badge-live" style={{ marginBottom: 16 }}>Thanks — message received.</div>}
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="c-name">Name</label>
                <input id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="c-email">Email</label>
                <input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="c-message">Message</label>
                <textarea id="c-message" rows="5" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <button className="btn btn-primary btn-block">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}