import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section container center" style={{ padding: "var(--space-9) 0" }}>
      <span className="mono" style={{ fontSize: "5rem", color: "var(--accent-primary)" }}>404</span>
      <h1 className="fs-h2">Looks like this road doesn't go anywhere</h1>
      <p className="text-muted" style={{ marginBottom: 24 }}>The page you're looking for isn't in our inventory.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </section>
  );
}
