import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/admin/DataTable";
import CrudModal from "../../components/admin/CrudModal";
import { addUser, updateUser, deleteUser } from "../../features/admin/adminSlice";

const FIELDS = [
  { key: "name", label: "Full Name", required: true },
  { key: "email", label: "Email", required: true },
  { key: "role", label: "Role", type: "select", options: ["Admin", "Staff", "Customer"] },
  { key: "status", label: "Status", type: "select", options: ["Active", "Suspended"] },
];

export default function AdminUsers() {
  const users = useSelector((s) => s.admin.users);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null);

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", sortable: true, render: (r) => <span className="badge">{r.role}</span> },
    { key: "joined", label: "Joined", sortable: true },
    { key: "status", label: "Status", render: (r) => <span className={`badge ${r.status === "Active" ? "badge-live" : "badge-ignition"}`}>{r.status}</span> },
  ];

  return (
    <div>
      <div className="section-head">
        <div><span className="eyebrow">People</span><h1 className="fs-h1">Manage Users</h1></div>
        <button className="btn btn-primary" onClick={() => setModal({ mode: "add", row: {} })}>+ Add User</button>
      </div>

      <DataTable
        columns={columns}
        rows={users}
        searchKeys={["name", "email", "role"]}
        onEdit={(row) => setModal({ mode: "edit", row })}
        onDelete={(row) => window.confirm(`Delete user ${row.name}?`) && dispatch(deleteUser(row.id))}
        emptyLabel="No users yet."
      />

      {modal && (
        <CrudModal
          title={modal.mode === "add" ? "Add User" : `Edit ${modal.row.name}`}
          fields={FIELDS}
          initialValues={modal.row}
          onClose={() => setModal(null)}
          onSubmit={(values) => {
            modal.mode === "add" ? dispatch(addUser(values)) : dispatch(updateUser({ id: modal.row.id, ...values }));
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
