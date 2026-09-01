import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearAuthError } from "../features/auth/authSlice";
import { useToast } from "../components/common/Toast";
import AuthShowcase from "../components/common/AuthShowcase";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const submitting = useSelector((s) => s.auth.status === "loading");

  const validate = () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    dispatch(clearAuthError());
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      toast?.("Welcome back!", "success");
      const role = result.payload?.role;
      navigate(role === "Admin" ? "/admin" : "/dashboard");
    } else {
      toast?.(result.payload || "Login failed", "error");
    }
  };

  return (
    <section className="auth-page">
      <div className="container auth-layout">
        <AuthShowcase
          title="Your account, one login away."
          subtitle="Track bookings, save wishlists, and revisit your EMI calculations any time."
        />
        <div className="auth-form-panel card">
          <span className="eyebrow">Welcome back</span>
          <h1 className="fs-h2">Log in to your account</h1>
          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="••••••••" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <div className="flex-between" style={{ marginBottom: 20 }}>
              <label className="checkbox-row">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="text-muted mono" style={{ fontSize: "var(--fs-xs)" }}>Forgot password?</Link>
            </div>
            <button className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Logging in…" : "Log In"}
            </button>
          </form>
          <p className="auth-switch text-muted">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}