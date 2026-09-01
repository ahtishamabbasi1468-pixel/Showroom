import Tilt3D from "./Tilt3D";

export default function AuthShowcase({ title, subtitle }) {
  return (
    <div className="auth-showcase">
      <Tilt3D strength={8} className="auth-showcase-tilt">
        <div className="auth-showcase-frame">
          <img
            src="https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1000&q=80"
            alt="Showroom floor"
          />
        </div>
      </Tilt3D>
      <h2 className="fs-h2">{title}</h2>
      <p className="text-secondary">{subtitle}</p>
      <ul className="auth-perks mono">
        <li>· Saved wishlist &amp; comparisons</li>
        <li>· One-tap re-booking</li>
        <li>· Priority service scheduling</li>
      </ul>
    </div>
  );
}
