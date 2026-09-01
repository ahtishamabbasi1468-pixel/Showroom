import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/admin/DataTable";
import CrudModal from "../../components/admin/CrudModal";
import { addNotification, deleteNotification } from "../../features/admin/adminSlice";

const FIELDS = [
  { key: "title", label: "Title", required: true, wide: true },
  { key: "message", label: "Message", type: "textarea", wide: true, required: true },
  { key: "audience", label: "Audience", type: "select", options: ["All Customers", "Test Drive Customers", "Service Customers", "Staff"] },
];

export default function AdminNotifications() {
  const notifications = useSelector((s) => s.admin.notifications);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);

  const columns = [
    { key: "title", label: "Title", sortable: true },
    { key: "message", label: "Message", render: (r) => <span className="table-truncate">{r.message}</span> },
    { key: "audience", label: "Audience" },
    { key: "date", label: "Sent", sortable: true },
  ];

  return (
    <div>
      <div className="section-head">
        <div><span className="eyebrow">Operations</span><h1 className="fs-h1">Notifications</h1></div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ Compose Notification</button>
      </div>

      <DataTable
        columns={columns}
        rows={notifications}
        searchKeys={["title", "audience"]}
        onDelete={(row) => window.confirm(`Delete notification "${row.title}"?`) && dispatch(deleteNotification(row.id))}
        emptyLabel="No notifications sent yet."
      />

      {modal && (
        <CrudModal
          title="Compose Notification"
          fields={FIELDS}
          initialValues={{ audience: "All Customers" }}
          onClose={() => setModal(false)}
          onSubmit={(values) => { dispatch(addNotification(values)); setModal(false); }}
        />
      )}
    </div>
  );
}
