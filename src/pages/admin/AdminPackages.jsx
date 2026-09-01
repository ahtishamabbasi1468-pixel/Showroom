import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/admin/DataTable";
import CrudModal from "../../components/admin/CrudModal";
import { addPackage, updatePackage, deletePackage } from "../../features/services/servicesSlice";

const FIELDS = [
  { key: "name", label: "Package Name", required: true },
  { key: "price", label: "Price (USD)", type: "number", required: true },
  { key: "items", label: "Included Items (comma-separated)", type: "textarea", wide: true, required: true },
];

export default function AdminPackages() {
  const packages = useSelector((s) => s.services.packages);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null);

  const columns = [
    { key: "name", label: "Package", sortable: true },
    { key: "price", label: "Price", sortable: true, render: (r) => `$${r.price}` },
    { key: "items", label: "Includes" },
  ];

  return (
    <div>
      <div className="section-head">
        <div><span className="eyebrow">Aftercare</span><h1 className="fs-h1">Manage Service Packages</h1></div>
        <button className="btn btn-primary" onClick={() => setModal({ mode: "add", row: {} })}>+ Add Package</button>
      </div>

      <DataTable
        columns={columns}
        rows={packages}
        searchKeys={["name"]}
        onEdit={(row) => setModal({ mode: "edit", row })}
        onDelete={(row) => window.confirm(`Delete package ${row.name}?`) && dispatch(deletePackage(row.id))}
        emptyLabel="No packages yet."
      />

      {modal && (
        <CrudModal
          title={modal.mode === "add" ? "Add Package" : `Edit ${modal.row.name}`}
          fields={FIELDS}
          initialValues={modal.row}
          onClose={() => setModal(null)}
          onSubmit={(values) => {
            modal.mode === "add" ? dispatch(addPackage(values)) : dispatch(updatePackage({ id: modal.row.id, ...values }));
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
