import { useSelector } from "react-redux";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { Link } from "react-router-dom";

const PIE_COLORS = ["#ff5a1f", "#00e0c6", "#8a929e"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Only these booking types ever count toward revenue. Test Drive and
// Service bookings never generate revenue, no matter what's in their
// `amount` field (manual admin entries included).
const REVENUE_TYPES = ["Buy", "Rent"];

export default function AdminDashboard() {
  const cars = useSelector((s) => s.cars.items);
  const bookings = useSelector((s) => s.admin.bookings);
  const customers = useSelector((s) => s.admin.customers);
  const reviews = useSelector((s) => s.content.reviews);

  const pending = bookings.filter((b) => b.status === "Pending").length;
  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
  const completed = bookings.filter((b) => b.status === "Completed").length;
  const inStock = cars.filter((c) => c.availability === "In Stock").length;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  const bookingSplit = [
    { name: "Confirmed", value: confirmed || 1 },
    { name: "Pending", value: pending },
    { name: "Completed", value: completed },
  ];

  // ---- Revenue trend: only Completed bookings of type Buy or Rent count.
  // Test Drive and Service bookings are excluded entirely, even if an
  // amount was accidentally entered for one. ----
  const now = new Date();
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTH_LABELS[d.getMonth()] };
  });

  const revenueBookings = bookings.filter(
    (b) => b.status === "Completed" && b.date && REVENUE_TYPES.includes(b.type)
  );

  const revenueByMonth = last6Months.map(({ key, label }) => {
    const revenue = revenueBookings
      .filter((b) => {
        const d = new Date(b.date);
        return `${d.getFullYear()}-${d.getMonth()}` === key;
      })
      .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    return { month: label, revenue };
  });

  const totalRevenue = revenueBookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const buyRevenue = revenueBookings.filter((b) => b.type === "Buy").reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const rentRevenue = revenueBookings.filter((b) => b.type === "Rent").reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  const thisMonth = revenueByMonth[revenueByMonth.length - 1]?.revenue || 0;
  const lastMonth = revenueByMonth[revenueByMonth.length - 2]?.revenue || 0;
  const momChange = lastMonth ? (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1) : null;

  return (
    <div className="admin-dashboard">
      <div className="section-head">
        <div>
          <span className="eyebrow">Overview</span>
          <h1 className="fs-h1">Dashboard</h1>
        </div>
        <span className="text-muted mono">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
      </div>

      <div className="grid grid-4">
        <div className="card stat-panel">
          <span className="mono stat-value">{cars.length}</span>
          <span className="text-muted stat-label">Total Cars ({inStock} in stock)</span>
        </div>
        <div className="card stat-panel">
          <span className="mono stat-value">{customers.length}</span>
          <span className="text-muted stat-label">Customers</span>
        </div>
        <div className="card stat-panel">
          <span className="mono stat-value">{bookings.length}</span>
          <span className="text-muted stat-label">Bookings ({pending} pending)</span>
        </div>
        <div className="card stat-panel">
          <span className="mono stat-value">{reviews.length ? `${avgRating} / 5` : "No ratings yet"}</span>
          <span className="text-muted stat-label">Avg. Review Rating</span>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginTop: "var(--space-4)" }}>
        <div className="card stat-panel">
          <span className="mono stat-value">${totalRevenue.toLocaleString()}</span>
          <span className="text-muted stat-label">Total Revenue (Buy + Rent)</span>
        </div>
        <div className="card stat-panel">
          <span className="mono stat-value">${buyRevenue.toLocaleString()}</span>
          <span className="text-muted stat-label">From Car Sales</span>
        </div>
        <div className="card stat-panel">
          <span className="mono stat-value">${rentRevenue.toLocaleString()}</span>
          <span className="text-muted stat-label">From Rentals</span>
        </div>
      </div>

      <div className="admin-dashboard-charts">
        <div className="card chart-card">
          <div className="flex-between">
            <h3>Revenue trend</h3>
            {momChange !== null && (
              <span className={`badge ${momChange >= 0 ? "badge-live" : "badge-ignition"}`}>
                {momChange >= 0 ? "+" : ""}{momChange}% MoM
              </span>
            )}
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueByMonth} margin={{ top: 16, right: 12, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff5a1f" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ff5a1f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,207,216,0.1)" vertical={false} />
              <XAxis dataKey="month" stroke="#8a929e" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8a929e" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: "#181b21", border: "1px solid rgba(201,207,216,0.2)", borderRadius: 8, fontSize: 13 }}
                formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#ff5a1f" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <h3>Booking status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={bookingSplit} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {bookingSplit.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#181b21", border: "1px solid rgba(201,207,216,0.2)", borderRadius: 8, fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend mono">
            {bookingSplit.map((s, i) => (
              <span key={s.name}><i style={{ background: PIE_COLORS[i] }} />{s.name} ({s.value})</span>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-dashboard-lists">
        <div className="card">
          <div className="flex-between" style={{ marginBottom: 12 }}>
            <h3>Recent bookings</h3>
            <Link to="/admin/bookings" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
          <div className="booking-list">
            {bookings.length === 0 && <p className="text-muted">No bookings yet.</p>}
            {bookings.slice(0, 4).map((b) => (
              <div className="booking-row" key={b.id}>
                <div>
                  <strong>{b.type} · {b.car}</strong>
                  <p className="text-muted mono" style={{ fontSize: "var(--fs-xs)" }}>
                    {b.customer} · {b.date}
                    {REVENUE_TYPES.includes(b.type) && b.amount ? ` · $${Number(b.amount).toLocaleString()}` : ""}
                  </p>
                </div>
                <span className={`badge ${b.status === "Confirmed" ? "badge-live" : b.status === "Pending" ? "badge-ignition" : ""}`}>{b.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex-between" style={{ marginBottom: 12 }}>
            <h3>Low stock alert</h3>
            <Link to="/admin/inventory" className="btn btn-ghost btn-sm">Inventory →</Link>
          </div>
          <div className="booking-list">
            {cars.filter((c) => (c.stock ?? 3) <= 2).slice(0, 4).map((c) => (
              <div className="booking-row" key={c.id}>
                <div>
                  <strong>{c.brand} {c.model}</strong>
                  <p className="text-muted mono" style={{ fontSize: "var(--fs-xs)" }}>{c.stock ?? 1} unit(s) left</p>
                </div>
                <span className="badge badge-ignition">Restock</span>
              </div>
            ))}
            {cars.filter((c) => (c.stock ?? 3) <= 2).length === 0 && <p className="text-muted">All models well stocked.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}