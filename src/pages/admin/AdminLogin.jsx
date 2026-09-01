import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login, logout, clearAuthError } from "../../features/auth/authSlice";
import { useToast } from "../../components/common/Toast";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const submitting = useSelector((s) => s.auth.status === "loading");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(login(form));

    if (!login.fulfilled.match(result)) {
      toast?.(result.payload || "Login failed", "error");
      return;
    }

    if (result.payload.role !== "Admin") {
      // Valid account, but not an admin — sign them back out of this session.
      await dispatch(logout());
      toast?.("Ye account admin nahi hai. Admin access ke liye role Firestore mein 'Admin' set karwayein.", "error");
      return;
    }

    toast?.("Welcome to the admin console", "success");
    navigate("/admin");
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card card">
        <div className="brand" style={{ marginBottom: 24, justifyContent: "center" }}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="26" height="26">
              <path d="M4 20 L8 12 Q10 9 14 9 H20 Q24 9 26 13 L28 20" stroke="var(--ignition-500)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <circle cx="9" cy="21" r="3" fill="var(--graphite-950)" stroke="var(--chrome-200)" strokeWidth="1.6" />
              <circle cx="23" cy="21" r="3" fill="var(--graphite-950)" stroke="var(--chrome-200)" strokeWidth="1.6" />
            </svg>
          </span>
          <span className="brand-text">IGNIS<span className="accent">ADMIN</span></span>
        </div>
        <span className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>Restricted access</span>
        <h1 className="fs-h2 center">Admin Console</h1>
        <p className="text-muted center" style={{ margin: "8px 0 24px" }}>Sign in to manage the showroom.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="a-email">Email</label>
            <input id="a-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="a-password">Password</label>
            <input id="a-password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p className="auth-switch text-muted">
          <Link to="/">← Back to showroom site</Link>
        </p>
      </div>
    </div>
  );
}
