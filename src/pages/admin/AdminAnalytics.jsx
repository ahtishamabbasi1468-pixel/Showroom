import { useSelector } from "react-redux";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AdminAnalytics() {
  const cars = useSelector((s) => s.cars.items);
  const bookings = useSelector((s) => s.admin.bookings);

  const byCategory = Object.entries(
    cars.reduce((acc, c) => { acc[c.category] = (acc[c.category] || 0) + 1; return acc; }, {})
  ).map(([name, count]) => ({ name, count }));

  const byBrand = Object.entries(
    cars.reduce((acc, c) => { acc[c.brand] = (acc[c.brand] || 0) + 1; return acc; }, {})
  ).map(([name, count]) => ({ name, count }));

  const bookingsByType = Object.entries(
    bookings.reduce((acc, b) => { acc[b.type] = (acc[b.type] || 0) + 1; return acc; }, {})
  ).map(([name, count]) => ({ name, count }));

  return (
    <div>
      <div className="section-head">
        <div><span className="eyebrow">Insights</span><h1 className="fs-h1">Analytics</h1></div>
      </div>

      <div className="admin-dashboard-charts">
        <div className="card chart-card">
          <h3>Inventory by category</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byCategory} margin={{ top: 16, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,207,216,0.1)" vertical={false} />
              <XAxis dataKey="name" stroke="#8a929e" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8a929e" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#181b21", border: "1px solid rgba(201,207,216,0.2)", borderRadius: 8, fontSize: 13 }} />
              <Bar dataKey="count" fill="#ff5a1f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <h3>Inventory by brand</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byBrand} margin={{ top: 16, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,207,216,0.1)" vertical={false} />
              <XAxis dataKey="name" stroke="#8a929e" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8a929e" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#181b21", border: "1px solid rgba(201,207,216,0.2)", borderRadius: 8, fontSize: 13 }} />
              <Bar dataKey="count" fill="#00e0c6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card chart-card" style={{ marginTop: "var(--space-5)" }}>
        <h3>Bookings by type</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={bookingsByType} layout="vertical" margin={{ top: 8, right: 24, left: 12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,207,216,0.1)" horizontal={false} />
            <XAxis type="number" stroke="#8a929e" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="name" stroke="#8a929e" fontSize={12} tickLine={false} axisLine={false} width={90} />
            <Tooltip contentStyle={{ background: "#181b21", border: "1px solid rgba(201,207,216,0.2)", borderRadius: 8, fontSize: 13 }} />
            <Bar dataKey="count" fill="#ff5a1f" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
