import { useSelector } from "react-redux";

export default function Blogs() {
  const blogs = useSelector((s) => s.content.blogs).filter((b) => b.status !== "Draft");

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">From the showroom floor</span>
            <h1 className="fs-h1">Blogs &amp; guides</h1>
          </div>
        </div>
        <div className="grid grid-3">
          {blogs.map((b) => (
            <article className="card blog-card" key={b.id}>
              <span className="mono text-muted" style={{ fontSize: "var(--fs-xs)" }}>
                {new Date(b.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <h3>{b.title}</h3>
              <p className="text-secondary">{b.excerpt}</p>
              <span className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}>Read more →</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
