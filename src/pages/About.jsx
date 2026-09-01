import Tilt3D from "../components/common/Tilt3D";

const TIMELINE = [
  { year: "2014", text: "Ignis Motors opens as a single-brand showroom with 12 cars on the floor." },
  { year: "2018", text: "First service center opens; inventory expands to six partner brands." },
  { year: "2022", text: "Online booking launches — test drives go from phone calls to two taps." },
  { year: "2026", text: "Twelve service centers, a certified pre-owned program, and this site." },
];

export default function About() {
  return (
    <>
      <section className="section about-hero">
        <div className="container about-hero-grid">
          <div>
            <span className="eyebrow">Since 2014</span>
            <h1 className="fs-h1">We sell cars the way we'd want to buy one.</h1>
            <p className="text-secondary" style={{ maxWidth: 520, marginTop: 16 }}>
              No pressure on the floor, no surprise fees at signing, and a service
              department that tells you what's actually wrong — not what pads the invoice.
            </p>
          </div>
          <Tilt3D strength={7} className="about-hero-tilt">
            <img
              src="https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&w=1000&q=80"
              alt="Showroom interior"
              style={{ borderRadius: "var(--radius-lg)" }}
            />
          </Tilt3D>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Our story</span>
              <h2>How we got here</h2>
            </div>
          </div>
          <div className="timeline">
            {TIMELINE.map((t) => (
              <div className="timeline-item" key={t.year}>
                <span className="mono timeline-year">{t.year}</span>
                <div className="timeline-line" />
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-3">
          {[
            { title: "Transparent pricing", body: "Every listing shows the out-the-door number — no fees revealed at the finance desk." },
            { title: "Certified inspections", body: "Every used car passes a 150-point inspection before it's listed, not after it's sold." },
            { title: "Real service slots", body: "Book the exact bay time you want online — no more waiting rooms." },
          ].map((v) => (
            <div className="card value-card" key={v.title}>
              <h3>{v.title}</h3>
              <p className="text-secondary">{v.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
