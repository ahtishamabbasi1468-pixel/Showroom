import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/admin/DataTable";
import CrudModal from "../../components/admin/CrudModal";
import { addStaff, updateStaff, deleteStaff } from "../../features/admin/adminSlice";

const FIELDS = [
  { key: "name", label: "Full Name", required: true },
  { key: "email", label: "Email", required: true },
  { key: "department", label: "Department", type: "select", options: ["Sales", "Service", "Inventory", "Front Desk", "Management"] },
  { key: "status", label: "Status", type: "select", options: ["Active", "On Leave", "Inactive"] },
];

export default function AdminStaff() {
  const staff = useSelector((s) => s.admin.staff);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null);

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email" },
    { key: "department", label: "Department", sortable: true },
    { key: "joined", label: "Joined", sortable: true },
    { key: "status", label: "Status", render: (r) => <span className={`badge ${r.status === "Active" ? "badge-live" : "badge-ignition"}`}>{r.status}</span> },
  ];

  return (
    <div>
      <div className="section-head">
        <div><span className="eyebrow">People</span><h1 className="fs-h1">Manage Staff</h1></div>
        <button className="btn btn-primary" onClick={() => setModal({ mode: "add", row: {} })}>+ Add Staff</button>
      </div>

      <DataTable
        columns={columns}
        rows={staff}
        searchKeys={["name", "email", "department"]}
        onEdit={(row) => setModal({ mode: "edit", row })}
        onDelete={(row) => window.confirm(`Remove staff member ${row.name}?`) && dispatch(deleteStaff(row.id))}
        emptyLabel="No staff members yet."
      />

      {modal && (
        <CrudModal
          title={modal.mode === "add" ? "Add Staff Member" : `Edit ${modal.row.name}`}
          fields={FIELDS}
          initialValues={modal.row}
          onClose={() => setModal(null)}
          onSubmit={(values) => {
            modal.mode === "add" ? dispatch(addStaff(values)) : dispatch(updateStaff({ id: modal.row.id, ...values }));
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
