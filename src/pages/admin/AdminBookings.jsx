import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/admin/DataTable";
import CrudModal from "../../components/admin/CrudModal";
import { addBooking, updateBookingStatus, deleteBooking } from "../../features/admin/adminSlice";

const REVENUE_TYPES = ["Buy", "Rent"];

export default function AdminBookings() {
  const bookings = useSelector((s) => s.admin.bookings);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("All");
  const [newType, setNewType] = useState("Test Drive");

  const filtered = filter === "All" ? bookings : bookings.filter((b) => b.status === filter);

  // Amount field only appears for Buy/Rent — Test Drive and Service never
  // carry a revenue amount, so there's nothing to accidentally mis-enter.
  const FIELDS = [
    { key: "type", label: "Type", type: "select", options: ["Test Drive", "Service", "Buy", "Rent"] },
    { key: "customer", label: "Customer", required: true },
    { key: "car", label: "Car / Service", required: true },
    { key: "date", label: "Date", type: "date", required: true },
    { key: "time", label: "Time", type: "time" },
    ...(REVENUE_TYPES.includes(newType)
      ? [{ key: "amount", label: "Amount (USD)", type: "number" }]
      : []),
  ];

  const columns = [
    { key: "type", label: "Type", sortable: true, render: (r) => (
      <span className={`badge ${r.type === "Buy" ? "badge-live" : r.type === "Rent" ? "badge-ignition" : ""}`}>{r.type}</span>
    ) },
    { key: "customer", label: "Customer", sortable: true },
    { key: "car", label: "Car / Service" },
    { key: "date", label: "Date", sortable: true },
    { key: "rentDays", label: "Days", render: (r) => (r.type === "Rent" ? r.rentDays || 1 : "—") },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (r) => (REVENUE_TYPES.includes(r.type) && r.amount ? `$${Number(r.amount).toLocaleString()}` : "—"),
    },
    { key: "status", label: "Status", render: (r) => (
      <span className={`badge ${r.status === "Confirmed" ? "badge-live" : r.status === "Pending" ? "badge-ignition" : ""}`}>{r.status}</span>
    ) },
    { key: "workflow", label: "Update", render: (r) => (
      <select
        className="table-inline-select"
        value={r.status}
        onChange={(e) => dispatch(updateBookingStatus({ id: r.id, status: e.target.value }))}
      >
        {["Pending", "Confirmed", "Completed", "Cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    ) },
  ];

  return (
    <div>
      <div className="section-head">
        <div><span className="eyebrow">Operations</span><h1 className="fs-h1">Manage Bookings</h1></div>
        <button className="btn btn-primary" onClick={() => { setNewType("Test Drive"); setModal(true); }}>+ Add Booking</button>
      </div>

      <div className="admin-filter-tabs">
        {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((f) => (
          <button key={f} className={`filter-tab ${filter === f ? "is-active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        searchKeys={["customer", "car"]}
        onDelete={(row) => window.confirm("Delete this booking?") && dispatch(deleteBooking(row.id))}
        emptyLabel="No bookings match this filter."
      />

      {modal && (
        <CrudModal
          key={newType}
          title="Add Booking"
          fields={FIELDS}
          initialValues={{ type: newType }}
          onClose={() => setModal(false)}
          onSubmit={(values) => {
            // Strip any accidental amount for non-revenue types before saving.
            const payload = REVENUE_TYPES.includes(values.type) ? values : { ...values, amount: 0 };
            dispatch(addBooking(payload));
            setModal(false);
          }}
        />
      )}
    </div>
  );
}