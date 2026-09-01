import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RatingStars from "../components/common/RatingStars";
import { addReview } from "../features/content/contentSlice";
import { useToast } from "../components/common/Toast";

export default function Reviews() {
  const list = useSelector((s) => s.content.reviews).filter((r) => r.status !== "Hidden");
  const [form, setForm] = useState({ car: "", rating: 5, text: "" });
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const submit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast?.("Log in to leave a review", "error");
      navigate("/login");
      return;
    }
    dispatch(addReview({
      name: user?.name || "You",
      status: "Published",
      ...form,
      // Leave the car field blank to review the showroom/service overall,
      // instead of one specific car.
      car: form.car.trim() || "Overall Experience",
    }));
    setForm({ car: "", rating: 5, text: "" });
    toast?.("Review posted — thank you!", "success");
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Customer reviews</span>
            <h1 className="fs-h1">What people are saying</h1>
          </div>
        </div>

        <div className="reviews-layout">
          <div className="grid" style={{ gap: "var(--space-4)" }}>
            {list.map((r) => (
              <div className="card review-row" key={r.id}>
                <div className="flex-between">
                  <strong>{r.name}</strong>
                  <RatingStars rating={r.rating} />
                </div>
                <span className="text-muted mono" style={{ fontSize: "var(--fs-xs)" }}>{r.car}</span>
                <p className="text-secondary" style={{ marginTop: 8 }}>{r.text}</p>
              </div>
            ))}
          </div>

          <div className="card review-form-panel">
            <h3>Leave a review</h3>
            <form onSubmit={submit}>
              <div className="field">
                <label htmlFor="rv-car">Car (optional)</label>
                <input
                  id="rv-car"
                  placeholder="Leave blank to review us overall"
                  value={form.car}
                  onChange={(e) => setForm({ ...form, car: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="rv-rating">Rating</label>
                <select id="rv-rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Star{n > 1 && "s"}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="rv-text">Review</label>
                <textarea id="rv-text" rows="4" required value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
              </div>
              <button className="btn btn-primary btn-block">Post Review</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}