import { useEffect, useState } from "react";
import { NavLink, Outlet, Navigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import {
  fetchCustomers, fetchStaff, fetchUsers, fetchBookings, fetchNotifications, fetchShowroom,
} from "../../features/admin/adminSlice";

const NAV_GROUPS = [
  {
    label: "Overview",
    links: [{ to: "/admin", label: "Dashboard", end: true, icon: "◧" }],
  },
  {
    label: "Catalog",
    links: [
      { to: "/admin/cars", label: "Cars", icon: "🚗" },
      { to: "/admin/inventory", label: "Inventory", icon: "▤" },
      { to: "/admin/brands", label: "Brands", icon: "◆" },
      { to: "/admin/categories", label: "Categories", icon: "▦" },
      { to: "/admin/services", label: "Services", icon: "🔧" },
      { to: "/admin/packages", label: "Service Packages", icon: "📦" },
    ],
  },
  {
    label: "People",
    links: [
      { to: "/admin/customers", label: "Customers", icon: "◉" },
      { to: "/admin/staff", label: "Staff", icon: "◎" },
      { to: "/admin/users", label: "Users", icon: "◐" },
    ],
  },
  {
    label: "Operations",
    links: [
      { to: "/admin/bookings", label: "Bookings", icon: "▧" },
      { to: "/admin/reviews", label: "Reviews", icon: "★" },
      { to: "/admin/blogs", label: "Blogs", icon: "▤" },
      { to: "/admin/notifications", label: "Notifications", icon: "◔" },
    ],
  },
  {
    label: "Insights",
    links: [
      { to: "/admin/analytics", label: "Analytics", icon: "▲" },
      { to: "/admin/settings", label: "Settings", icon: "⚙" },
    ],
  },
];

export function ProtectedAdminRoute() {
  const { isAuthenticated, user, authReady } = useSelector((s) => s.auth);
  // Wait for Firebase's own auth listener to fire once before deciding —
  // otherwise a page refresh briefly looks "logged out" and bounces to /login.
  if (!authReady) return null;
  if (!isAuthenticated || user?.role !== "Admin") {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();

  // Bootstrap the admin-only collections once the console mounts.
  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchStaff());
    dispatch(fetchUsers());
    dispatch(fetchBookings());
    dispatch(fetchNotifications());
    dispatch(fetchShowroom());
  }, [dispatch]);

  return (
    <div className={`admin-shell ${collapsed ? "is-collapsed" : ""}`}>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-head">
          <Link to="/admin" className="brand">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="24" height="24">
                <path d="M4 20 L8 12 Q10 9 14 9 H20 Q24 9 26 13 L28 20" stroke="var(--ignition-500)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                <circle cx="9" cy="21" r="3" fill="var(--graphite-950)" stroke="var(--chrome-200)" strokeWidth="1.6" />
                <circle cx="23" cy="21" r="3" fill="var(--graphite-950)" stroke="var(--chrome-200)" strokeWidth="1.6" />
              </svg>
            </span>
            {!collapsed && <span className="brand-text" style={{ fontSize: "1.05rem" }}>IGNIS<span className="accent">ADMIN</span></span>}
          </Link>
          <button className="icon-btn" onClick={() => setCollapsed((c) => !c)} aria-label="Toggle sidebar">
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="admin-nav">
          {NAV_GROUPS.map((group) => (
            <div className="admin-nav-group" key={group.label}>
              {!collapsed && <span className="admin-nav-label">{group.label}</span>}
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `admin-nav-link ${isActive ? "is-active" : ""}`}
                  title={link.label}
                >
                  <span className="admin-nav-icon">{link.icon}</span>
                  {!collapsed && <span>{link.label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <span className="mono text-muted" style={{ fontSize: "var(--fs-xs)" }}>Ignis Motors · Admin Console</span>
          <div className="flex gap-3">
            <Link to="/" className="btn btn-ghost btn-sm">View Site</Link>
            <div className="user-chip">
              <span className="user-avatar mono">{user?.name?.[0]?.toUpperCase() || "A"}</span>
              <span className="user-name">{user?.name || "Admin"}</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => dispatch(logout())}>Log out</button>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}