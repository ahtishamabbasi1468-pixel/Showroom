import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Tilt3D from "../components/common/Tilt3D";
import RatingStars from "../components/common/RatingStars";
import CarCard from "../components/common/CarCard";
import { toggleWishlist, selectIsWishlisted } from "../features/wishlist/wishlistSlice";
import { rateCar } from "../features/cars/carsSlice";
import { addBooking } from "../features/admin/adminSlice";
import { fetchUserRatingForCar } from "../firebase/ratingsService";
import { useToast } from "../components/common/Toast";

const SPEC_LABELS = {
  engine: "Engine", transmission: "Transmission", fuelType: "Fuel Type",
  horsePower: "Horsepower", mileage: "Mileage (mpg-e)", color: "Color", condition: "Condition",
};

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const cars = useSelector((s) => s.cars.items);
  const car = cars.find((c) => c.id === id);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const user = useSelector((s) => s.auth.user);
  const wishlisted = useSelector((s) => selectIsWishlisted(s, id));
  const [activeImg, setActiveImg] = useState(0);

  // showBooking now holds which flow is open: "Test Drive" | "Buy" | "Rent" | null
  const [showBooking, setShowBooking] = useState(null);
  const [form, setForm] = useState({ date: "", time: "", name: "", phone: "", rentDays: 1 });

  const [myRating, setMyRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.uid || !id) return;
    fetchUserRatingForCar(id, user.uid).then((existing) => {
      if (existing) {
        setMyRating(existing.value);
        setRatingComment(existing.comment || "");
      }
    });
  }, [isAuthenticated, user?.uid, id]);

  if (!car) {
    return (
      <section className="section container center">
        <h2>Car not found</h2>
        <Link to="/cars" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Inventory</Link>
      </section>
    );
  }

  const related = cars.filter((c) => c.category === car.category && c.id !== car.id).slice(0, 3);

  const listingType = car.listingType || "For Sale";
  const canBuy = listingType === "For Sale" || listingType === "Both";
  const canRent = listingType === "For Rent" || listingType === "Both";

  const openFlow = (flow) => {
    if (!isAuthenticated) {
      toast?.("Please log in to continue", "error");
      navigate("/login");
      return;
    }
    setForm({ date: "", time: "", name: "", phone: "", rentDays: 1 });
    setShowBooking(flow);
  };

  const submitBooking = (e) => {
    e.preventDefault();

    const isRent = showBooking === "Rent";
    const isBuy = showBooking === "Buy";
    const amount = isRent
      ? Number(car.rentPricePerDay || 0) * Number(form.rentDays || 1)
      : isBuy
      ? Number(car.price || 0)
      : 0;

    dispatch(addBooking({
      type: showBooking, // "Test Drive" | "Buy" | "Rent"
      customer: form.name || user?.name || "Customer",
      customerEmail: user?.email || "",
      car: `${car.brand} ${car.model}`,
      date: form.date,
      time: form.time,
      phone: form.phone,
      status: "Pending",
      amount,
      ...(isRent ? { rentDays: Number(form.rentDays) || 1 } : {}),
    }));

    setShowBooking(null);
    const messages = {
      "Test Drive": `Test drive for ${car.model} requested — we'll confirm by email.`,
      Buy: `Purchase request for ${car.model} sent — our team will contact you to finalize.`,
      Rent: `Rental request for ${car.model} (${form.rentDays} day${form.rentDays > 1 ? "s" : ""}) sent — we'll confirm shortly.`,
    };
    toast?.(messages[showBooking] || "Request sent", "success");
    setForm({ date: "", time: "", name: "", phone: "", rentDays: 1 });
  };

  const submitRating = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast?.("Rate karne ke liye login karein", "error");
      navigate("/login");
      return;
    }
    if (!myRating) return;
    setSubmittingRating(true);
    const result = await dispatch(rateCar({
      carId: car.id,
      uid: user.uid,
      value: myRating,
      comment: ratingComment,
      userName: user.name,
    }));
    setSubmittingRating(false);
    if (rateCar.fulfilled.match(result)) {
      toast?.("Rating jama ho gayi — shukriya!", "success");
    } else {
      toast?.(result.payload || "Rating jama nahi ho saki", "error");
    }
  };

  const rentTotal = Number(car.rentPricePerDay || 0) * Number(form.rentDays || 1);

  return (
    <section className="section car-details">
      <div className="container">
        <div className="breadcrumbs mono text-muted">
          <Link to="/cars">Cars</Link> / <span>{car.brand} {car.model}</span>
        </div>

        <div className="details-layout">
          {/* ---- Gallery ---- */}
          <div className="details-gallery">
            <Tilt3D strength={5} className="details-hero-img">
              <img src={car.gallery[activeImg]} alt={`${car.model} view ${activeImg + 1}`} />
            </Tilt3D>
            <div className="thumb-row">
              {car.gallery.map((img, i) => (
                <button
                  key={img}
                  className={`thumb ${activeImg === i ? "is-active" : ""}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* ---- Info ---- */}
          <div className="details-info">
            <span className="eyebrow">{car.brand} · {car.year}</span>
            <div className="flex-between">
              <h1 className="fs-h1">{car.model}</h1>
              <button
                className={`wishlist-btn static ${wishlisted ? "is-active" : ""}`}
                onClick={() => dispatch(toggleWishlist(car.id))}
                aria-label="Toggle wishlist"
              >
                {wishlisted ? "♥" : "♡"}
              </button>
            </div>
            <RatingStars rating={car.rating} reviews={car.reviews} />
            <p className="details-desc">{car.description}</p>

            <div className="price-block">
              {canBuy && (
                <span className="mono price-value">${Number(car.price).toLocaleString()}</span>
              )}
              {canRent && (
                <span className="mono price-value" style={{ fontSize: "1rem", marginLeft: canBuy ? 12 : 0 }}>
                  ${Number(car.rentPricePerDay || 0).toLocaleString()}/day rent
                </span>
              )}
              <span className={`badge ${car.availability === "In Stock" ? "badge-live" : "badge-ignition"}`}>
                {car.availability}
              </span>
            </div>

            <div className="details-actions">
              {canBuy && (
                <button className="btn btn-primary" onClick={() => openFlow("Buy")}>Buy This Car</button>
              )}
              {canRent && (
                <button className="btn btn-outline-volt" onClick={() => openFlow("Rent")}>Rent This Car</button>
              )}
              <button className="btn btn-ghost" onClick={() => openFlow("Test Drive")}>Book Test Drive</button>
              <Link to="/finance" state={{ price: car.price }} className="btn btn-outline-volt">Calculate EMI</Link>
            </div>

            <div className="spec-grid mono">
              {Object.entries(SPEC_LABELS).map(([key, label]) => (
                <div className="spec-item" key={key}>
                  <span className="text-muted">{label}</span>
                  <span>{car[key]}</span>
                </div>
              ))}
            </div>

            <div className="features-block">
              <h3>Features</h3>
              <ul className="feature-list">
                {car.features.map((f) => (
                  <li key={f}><span className="feature-dot" />{f}</li>
                ))}
              </ul>
            </div>

            <div className="features-block rate-this-car">
              <h3>{myRating ? "Your rating" : "Rate this car"}</h3>
              <form onSubmit={submitRating}>
                <div className="rating-input" role="radiogroup" aria-label="Rate this car">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      className="star-btn"
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setMyRating(n)}
                    >
                      {(hoverRating || myRating) >= n ? "★" : "☆"}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={2}
                  placeholder="Optional comment about this car…"
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  style={{ marginTop: 10, width: "100%" }}
                />
                <button className="btn btn-outline-volt btn-sm" style={{ marginTop: 10 }} disabled={!myRating || submittingRating}>
                  {submittingRating ? "Saving…" : myRating ? "Update Rating" : "Submit Rating"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="section">
            <div className="section-head">
              <h2>Similar {car.category}s</h2>
            </div>
            <div className="grid grid-3">
              {related.map((c, i) => <CarCard car={c} key={c.id} index={i} />)}
            </div>
          </div>
        )}
      </div>

      {showBooking && (
        <div className="modal-overlay" onClick={() => setShowBooking(null)}>
          <motion.div
            className="modal card"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex-between">
              <h3>
                {showBooking === "Buy" ? "Buy This Car" : showBooking === "Rent" ? "Rent This Car" : "Book a Test Drive"}
              </h3>
              <button className="icon-btn" onClick={() => setShowBooking(null)} aria-label="Close">✕</button>
            </div>
            <p className="text-muted" style={{ marginBottom: 20 }}>{car.brand} {car.model} · {car.year}</p>

            <form onSubmit={submitBooking}>
              {showBooking === "Rent" ? (
                <>
                  <div className="grid grid-2">
                    <div className="field">
                      <label htmlFor="bk-date">Start Date</label>
                      <input id="bk-date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                    </div>
                    <div className="field">
                      <label htmlFor="bk-days">Number of Days</label>
                      <input
                        id="bk-days"
                        type="number"
                        min="1"
                        required
                        value={form.rentDays}
                        onChange={(e) => setForm({ ...form, rentDays: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="rent-total-box" style={{ margin: "12px 0", padding: 12, borderRadius: 8, background: "rgba(255,90,31,0.08)" }}>
                    <span className="mono">
                      Total: <strong>${rentTotal.toLocaleString()}</strong> for {form.rentDays || 1} day{Number(form.rentDays) > 1 ? "s" : ""}
                    </span>
                  </div>
                </>
              ) : showBooking === "Buy" ? (
                <div className="field">
                  <label htmlFor="bk-date">Preferred Purchase Date</label>
                  <input id="bk-date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  <p className="text-muted mono" style={{ marginTop: 8, fontSize: "var(--fs-xs)" }}>
                    Total price: ${Number(car.price).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="grid grid-2">
                  <div className="field">
                    <label htmlFor="bk-date">Preferred Date</label>
                    <input id="bk-date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div className="field">
                    <label htmlFor="bk-time">Preferred Time</label>
                    <input id="bk-time" type="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                  </div>
                </div>
              )}

              <div className="field">
                <label htmlFor="bk-name">Full Name</label>
                <input id="bk-name" required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="bk-phone">Phone</label>
                <input id="bk-phone" required placeholder="+92 300 0000000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                {showBooking === "Buy" ? "Confirm Purchase Request" : showBooking === "Rent" ? "Confirm Rental Request" : "Confirm Booking"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
}