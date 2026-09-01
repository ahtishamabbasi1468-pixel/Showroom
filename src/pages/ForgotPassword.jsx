import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendPasswordReset, clearAuthError } from "../features/auth/authSlice";
import { useToast } from "../components/common/Toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  const submitting = useSelector((s) => s.auth.status === "loading");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(sendPasswordReset(email));
    if (sendPasswordReset.fulfilled.match(result)) {
      setSent(true);
      toast?.("Reset link sent — check your inbox.", "success");
    } else {
      // Don't reveal whether the email exists — same message either way.
      setSent(true);
    }
  };

  return (
    <section className="auth-page center">
      <div className="container" style={{ maxWidth: 460 }}>
        <div className="auth-form-panel card">
          <span className="eyebrow">Account recovery</span>
          <h1 className="fs-h2">Reset your password</h1>
          <p className="text-muted" style={{ marginBottom: 20 }}>
            Enter the email you registered with and we'll send a reset link.
          </p>
          {sent ? (
            <div className="badge badge-live" style={{ padding: "12px 16px" }}>Check your inbox for a reset link.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="fp-email">Email</label>
                <input id="fp-email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          )}
          <p className="auth-switch text-muted">
            <Link to="/login">← Back to log in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
