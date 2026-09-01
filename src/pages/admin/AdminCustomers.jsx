import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/admin/DataTable";
import CrudModal from "../../components/admin/CrudModal";
import { addCustomer, updateCustomer, deleteCustomer } from "../../features/admin/adminSlice";

const FIELDS = [
  { key: "name", label: "Full Name", required: true },
  { key: "email", label: "Email", type: "text", required: true },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status", type: "select", options: ["Active", "Suspended"] },
];

export default function AdminCustomers() {
  const customers = useSelector((s) => s.admin.customers);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null);

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "joined", label: "Joined", sortable: true },
    { key: "bookings", label: "Bookings", sortable: true },
    { key: "status", label: "Status", render: (r) => <span className={`badge ${r.status === "Active" ? "badge-live" : "badge-ignition"}`}>{r.status}</span> },
  ];

  return (
    <div>
      <div className="section-head">
        <div><span className="eyebrow">People</span><h1 className="fs-h1">Manage Customers</h1></div>
        <button className="btn btn-primary" onClick={() => setModal({ mode: "add", row: {} })}>+ Add Customer</button>
      </div>

      <DataTable
        columns={columns}
        rows={customers}
        searchKeys={["name", "email", "phone"]}
        onEdit={(row) => setModal({ mode: "edit", row })}
        onDelete={(row) => window.confirm(`Delete customer ${row.name}?`) && dispatch(deleteCustomer(row.id))}
        emptyLabel="No customers yet."
      />

      {modal && (
        <CrudModal
          title={modal.mode === "add" ? "Add Customer" : `Edit ${modal.row.name}`}
          fields={FIELDS}
          initialValues={modal.row}
          onClose={() => setModal(null)}
          onSubmit={(values) => {
            modal.mode === "add" ? dispatch(addCustomer(values)) : dispatch(updateCustomer({ id: modal.row.id, ...values }));
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
