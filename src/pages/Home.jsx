import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import Tilt3D from "../components/common/Tilt3D";
import CarCard from "../components/common/CarCard";
import RatingStars from "../components/common/RatingStars";

export default function Home() {
  const cars = useSelector((s) => s.cars.items);
  const SERVICES = useSelector((s) => s.services.services);
  const REVIEWS = useSelector((s) => s.content.reviews).filter((r) => r.status !== "Hidden");
  const adminCategories = useSelector((s) => s.admin.categories);
  const bookings = useSelector((s) => s.admin.bookings);
  const home = useSelector((s) => s.content.homeContent);

  const CATEGORIES = adminCategories.length
    ? ["All", ...adminCategories.map((c) => c.name)]
    : ["All", ...new Set(cars.map((c) => c.category))];
  const featured = cars.slice(0, 3);

  // ---- Live-computed stats (real data, not hardcoded) ----
  const deliveredCount = bookings.filter((b) => b.status === "Completed").length;
  const avgRating = REVIEWS.length
    ? (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length).toFixed(1)
    : "—";

  const computedStats = [
    { label: "Cars Delivered", value: `${deliveredCount}+` },
    { label: "Avg. Delivery Time", value: home.avgDeliveryTime },
    { label: "Service Centers", value: home.serviceCenters },
    { label: "Customer Rating", value: REVIEWS.length ? `${avgRating} / 5` : "No ratings yet" },
  ];

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="hero">
        <div className="container hero-inner">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow">{home.eyebrow}</span>
            <h1 className="hero-title">
              {home.titleLine1}<br /> {home.titleLine2} <span className="accent">{home.titleAccent}</span>
            </h1>
            <p className="hero-sub">{home.subtitle}</p>
            <div className="hero-actions">
              <Link to="/cars" className="btn btn-primary">Browse Inventory</Link>
              <Link to="/finance" className="btn btn-ghost">Calculate EMI</Link>
            </div>
            <div className="hero-strip mono">
              {home.heroSpecs.map((spec, i) => (
                <span key={spec.label}>
                  {spec.label} <strong>{spec.value}</strong>
                  {i < home.heroSpecs.length - 1 && <span className="dot"> · </span>}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="hero-art"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <Tilt3D strength={10} className="hero-tilt">
              <div className="hero-image-frame">
                <img src={home.heroImage} alt="Featured performance car" />
                <div className="hero-gauge">
                  <span className="mono hero-gauge-value">{home.gaugeValue}</span>
                  <span className="mono hero-gauge-label">{home.gaugeLabel}</span>
                </div>
              </div>
            </Tilt3D>
          </motion.div>
        </div>

        <div className="hero-marquee mono" aria-hidden="true">
          <div className="hero-marquee-track">
            {Array.from({ length: 2 }).flatMap(() => home.marqueeBrands).map((b, i) => (
              <span key={i}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Stats ---------------- */}
      <section className="section stats-section">
        <div className="container grid grid-4">
          {computedStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat-panel card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <span className="mono stat-value">{stat.value}</span>
              <span className="text-muted stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- Categories ---------------- */}
      <section className="section category-section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Inventory</span>
              <h2>Shop by body style</h2>
            </div>
            <Link to="/cars" className="btn btn-outline-volt btn-sm">View all cars →</Link>
          </div>
          <div className="category-strip">
            {CATEGORIES.filter((c) => c !== "All").map((cat) => (
              <Link key={cat} to={`/cars?category=${cat}`} className="category-pill">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Featured Cars ---------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Featured</span>
              <h2>Recently arrived</h2>
            </div>
            <Link to="/cars" className="btn btn-ghost btn-sm">Full inventory →</Link>
          </div>
          <div className="grid grid-3">
            {featured.map((car, i) => (
              <CarCard car={car} key={car.id} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Services strip ---------------- */}
      <section className="section services-section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Aftercare</span>
              <h2>Service, without the waiting room</h2>
            </div>
            <Link to="/services" className="btn btn-ghost btn-sm">All services →</Link>
          </div>
          <div className="grid grid-4">
            {SERVICES.slice(0, 4).map((s) => (
              <div className="card service-mini" key={s.id}>
                <span className="service-mini-price mono">${s.price}</span>
                <h3>{s.name}</h3>
                <span className="text-muted mono" style={{ fontSize: "var(--fs-xs)" }}>{s.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Reviews ---------------- */}
      <section className="section reviews-section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Word on the lot</span>
              <h2>What customers say</h2>
            </div>
          </div>
          <div className="grid grid-3">
            {REVIEWS.length === 0 && <p className="text-muted">No reviews yet — be the first to share your experience.</p>}
            {REVIEWS.map((r) => (
              <div className="card review-card" key={r.id}>
                <RatingStars rating={r.rating} />
                <p className="review-text">&ldquo;{r.text}&rdquo;</p>
                <div className="review-meta">
                  <span className="review-name">{r.name}</span>
                  <span className="text-muted mono" style={{ fontSize: "var(--fs-xs)" }}>{r.car}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="section">
        <div className="container">
          <div className="cta-panel">
            <div>
              <h2>Ready to see it in person?</h2>
              <p className="text-secondary">Book a test drive and we'll have the car pulled up front when you arrive.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/cars" className="btn btn-primary">Book Test Drive</Link>
              <Link to="/contact" className="btn btn-ghost">Contact Showroom</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}