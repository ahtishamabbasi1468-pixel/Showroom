import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/cars", label: "Cars" },
  { to: "/services", label: "Services" },
  { to: "/finance", label: "Finance" },
  { to: "/blogs", label: "Blogs" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const wishlistCount = useSelector((s) => s.wishlist.ids.length);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="26" height="26">
              <path d="M4 20 L8 12 Q10 9 14 9 H20 Q24 9 26 13 L28 20" stroke="var(--ignition-500)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <circle cx="9" cy="21" r="3" fill="var(--graphite-950)" stroke="var(--chrome-200)" strokeWidth="1.6" />
              <circle cx="23" cy="21" r="3" fill="var(--graphite-950)" stroke="var(--chrome-200)" strokeWidth="1.6" />
            </svg>
          </span>
          <span className="brand-text">
            IGNIS<span className="accent">MOTORS</span>
          </span>
        </Link>

        <nav className={`nav-links ${open ? "is-open" : ""}`}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? "is-active" : ""}`}
              onClick={() => setOpen(false)}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          <button className="icon-btn" onClick={onToggleTheme} aria-label="Toggle theme" title="Toggle dark / light">
            {theme === "theme-light" ? "☀" : "☾"}
          </button>
          <Link to="/wishlist" className="icon-btn wishlist-icon" aria-label="Wishlist">
            ♡{wishlistCount > 0 && <span className="icon-badge mono">{wishlistCount}</span>}
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              {isAdmin && (
                <Link to="/admin" className="btn btn-outline-volt btn-sm">
                  Admin
                </Link>
              )}
              <button className="user-chip" onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}>
                <span className="user-avatar mono">{user?.name?.[0]?.toUpperCase() || "U"}</span>
                <span className="user-name">{user?.name?.split(" ")[0]}</span>
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => dispatch(logout())}>
                Log out
              </button>
            </div>
          ) : (
            <div className="auth-actions">
              <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Book a Test Drive</Link>
            </div>
          )}

          <button
            className={`hamburger ${open ? "is-open" : ""}`}
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}