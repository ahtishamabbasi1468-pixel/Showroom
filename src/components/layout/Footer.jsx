import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="brand-text">
            IGNIS<span className="accent">MOTORS</span>
          </span>
          <p className="text-muted" style={{ maxWidth: 320, marginTop: 12 }}>
            A showroom built around one idea: buying and servicing a car should feel
            as considered as driving one.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="YouTube">YT</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/cars">Browse Cars</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/finance">Finance Calculator</Link></li>
            <li><Link to="/blogs">Blogs</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Log In</Link></li>
            <li><Link to="/register">Create Account</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/admin/login">Admin Login</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Showroom</h4>
          <ul className="text-muted">
            <li>221 Ravel Motorway, Rawalpindi</li>
            <li>Mon–Sat · 9:00 AM – 8:00 PM</li>
            <li>+92 300 000 0000</li>
            <li>hello@ignismotors.example</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span className="text-muted mono">© {new Date().getFullYear()} Ignis Motors. All rights reserved.</span>
        <span className="text-muted mono">Frontend build · backend integration next</span>
      </div>
    </footer>
  );
}
