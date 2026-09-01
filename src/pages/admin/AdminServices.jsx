import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/admin/DataTable";
import CrudModal from "../../components/admin/CrudModal";
import { addService, updateService, deleteService } from "../../features/services/servicesSlice";

const FIELDS = [
  { key: "name", label: "Service Name", required: true },
  { key: "duration", label: "Estimated Duration", required: true },
  { key: "price", label: "Price (USD)", type: "number", required: true },
];

export default function AdminServices() {
  const services = useSelector((s) => s.services.services);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null);

  const columns = [
    { key: "name", label: "Service", sortable: true },
    { key: "duration", label: "Duration" },
    { key: "price", label: "Price", sortable: true, render: (r) => `$${r.price}` },
  ];

  return (
    <div>
      <div className="section-head">
        <div><span className="eyebrow">Aftercare</span><h1 className="fs-h1">Manage Services</h1></div>
        <button className="btn btn-primary" onClick={() => setModal({ mode: "add", row: {} })}>+ Add Service</button>
      </div>

      <DataTable
        columns={columns}
        rows={services}
        searchKeys={["name"]}
        onEdit={(row) => setModal({ mode: "edit", row })}
        onDelete={(row) => window.confirm(`Delete service ${row.name}?`) && dispatch(deleteService(row.id))}
        emptyLabel="No services yet."
      />

      {modal && (
        <CrudModal
          title={modal.mode === "add" ? "Add Service" : `Edit ${modal.row.name}`}
          fields={FIELDS}
          initialValues={modal.row}
          onClose={() => setModal(null)}
          onSubmit={(values) => {
            modal.mode === "add" ? dispatch(addService(values)) : dispatch(updateService({ id: modal.row.id, ...values }));
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
