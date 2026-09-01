import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearAuthError } from "../features/auth/authSlice";
import { useToast } from "../components/common/Toast";
import AuthShowcase from "../components/common/AuthShowcase";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const submitting = useSelector((s) => s.auth.status === "loading");

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!/^\+?\d{7,15}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid phone number";
    if (form.password.length < 6) e.password = "At least 6 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    dispatch(clearAuthError());
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      toast?.("Account created — welcome to Ignis Motors!", "success");
      navigate("/dashboard");
    } else {
      toast?.(result.payload || "Registration failed", "error");
    }
  };

  return (
    <section className="auth-page">
      <div className="container auth-layout">
        <AuthShowcase
          title="Create your account."
          subtitle="Takes under a minute. You'll need it to confirm any test drive or service booking."
        />
        <div className="auth-form-panel card">
          <span className="eyebrow">Get started</span>
          <h1 className="fs-h2">Create an account</h1>
          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Full Name</label>
              <input id="name" placeholder="Ali Khan" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="grid grid-2">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" placeholder="+92 300 0000000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>
            </div>
            <div className="grid grid-2">
              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>
              <div className="field">
                <label htmlFor="confirm">Confirm Password</label>
                <input id="confirm" type="password" placeholder="••••••••" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
                {errors.confirm && <span className="field-error">{errors.confirm}</span>}
              </div>
            </div>
            <button className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Creating account…" : "Create Account"}
            </button>
          </form>
          <p className="auth-switch text-muted">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
