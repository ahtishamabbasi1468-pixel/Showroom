import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBookings } from "../features/admin/adminSlice";

const TABS = ["Overview", "My Profile", "Wishlist", "Bookings", "Notifications", "Settings"];

const MOCK_NOTIFICATIONS = [
  { id: "n1", text: "Your test drive for Aster Meridian GT was approved.", time: "2h ago" },
  { id: "n2", text: "Reminder: service booking tomorrow at 10:00 AM.", time: "1d ago" },
  { id: "n3", text: "New offer: 0% APR on select EVs this month.", time: "3d ago" },
];

export default function Dashboard() {
  const [tab, setTab] = useState("Overview");
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const wishlistIds = useSelector((s) => s.wishlist.ids);
  const allBookings = useSelector((s) => s.admin.bookings);
  const myBookings = allBookings.filter((b) => b.customerEmail && b.customerEmail === user?.email);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  return (
    <section className="section dashboard">
      <div className="container dashboard-layout">
        <aside className="dashboard-sidebar card">
          <div className="dashboard-user">
            <span className="user-avatar mono" style={{ width: 44, height: 44, fontSize: 16 }}>
              {user?.name?.[0]?.toUpperCase() || "U"}
            </span>
            <div>
              <strong>{user?.name || "Guest"}</strong>
              <p className="text-muted mono" style={{ fontSize: "var(--fs-xs)" }}>{user?.email}</p>
            </div>
          </div>
          <nav className="dashboard-nav">
            {TABS.map((t) => (
              <button key={t} className={`dashboard-nav-item ${tab === t ? "is-active" : ""}`} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </nav>
        </aside>

        <div className="dashboard-content">
          {tab === "Overview" && (
            <>
              <h2>Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h2>
              <div className="grid grid-3" style={{ marginTop: 20 }}>
                <div className="card stat-panel"><span className="mono stat-value">{myBookings.length}</span><span className="text-muted stat-label">Active Bookings</span></div>
                <div className="card stat-panel"><span className="mono stat-value">{wishlistIds.length}</span><span className="text-muted stat-label">Wishlisted Cars</span></div>
                <div className="card stat-panel"><span className="mono stat-value">{MOCK_NOTIFICATIONS.length}</span><span className="text-muted stat-label">Notifications</span></div>
              </div>
            </>
          )}

          {tab === "My Profile" && (
            <>
              <h2>My Profile</h2>
              <div className="card" style={{ padding: 24, marginTop: 16 }}>
                <div className="field"><label>Full Name</label><input defaultValue={user?.name} /></div>
                <div className="field"><label>Email</label><input defaultValue={user?.email} /></div>
                <div className="field"><label>Phone</label><input placeholder="+92 300 0000000" /></div>
                <button className="btn btn-primary btn-sm">Save Changes</button>
              </div>
            </>
          )}

          {tab === "Wishlist" && (
            <>
              <h2>Wishlist</h2>
              <p className="text-muted" style={{ marginTop: 8 }}>
                {wishlistIds.length} saved car{wishlistIds.length !== 1 && "s"}. <Link to="/wishlist">View full wishlist →</Link>
              </p>
            </>
          )}

          {tab === "Bookings" && (
            <>
              <h2>Bookings</h2>
              <div className="booking-list">
                {myBookings.length === 0 && <p className="text-muted" style={{ marginTop: 12 }}>No bookings yet — book a test drive or a service to see it here.</p>}
                {myBookings.map((b) => (
                  <div className="card booking-row" key={b.id}>
                    <div>
                      <strong>{b.type} · {b.car}</strong>
                      <p className="text-muted mono" style={{ fontSize: "var(--fs-xs)" }}>{b.date} {b.time}</p>
                    </div>
                    <span className={`badge ${b.status === "Confirmed" ? "badge-live" : "badge-ignition"}`}>{b.status}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "Notifications" && (
            <>
              <h2>Notifications</h2>
              <div className="notification-list">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div className="card notification-row" key={n.id}>
                    <p>{n.text}</p>
                    <span className="text-muted mono" style={{ fontSize: "var(--fs-xs)" }}>{n.time}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "Settings" && (
            <>
              <h2>Settings</h2>
              <div className="card" style={{ padding: 24, marginTop: 16 }}>
                <label className="checkbox-row"><input type="checkbox" defaultChecked /> Email me about new offers</label>
                <label className="checkbox-row"><input type="checkbox" defaultChecked /> Booking reminders</label>
                <label className="checkbox-row"><input type="checkbox" /> SMS notifications</label>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
