import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/admin/DataTable";
import CrudModal from "../../components/admin/CrudModal";
import { addBrand, updateBrand, deleteBrand } from "../../features/admin/adminSlice";

const FIELDS = [
  { key: "name", label: "Brand Name", required: true },
  { key: "country", label: "Country" },
  { key: "founded", label: "Founded (Year)", type: "number" },
  { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
];

export default function AdminBrands() {
  const brands = useSelector((s) => s.admin.brands);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null);

  const columns = [
    { key: "name", label: "Brand", sortable: true },
    { key: "country", label: "Country", sortable: true },
    { key: "founded", label: "Founded", sortable: true },
    { key: "carsListed", label: "Cars Listed", sortable: true },
    { key: "status", label: "Status", render: (r) => <span className={`badge ${r.status === "Active" ? "badge-live" : ""}`}>{r.status}</span> },
  ];

  return (
    <div>
      <div className="section-head">
        <div><span className="eyebrow">Catalog</span><h1 className="fs-h1">Manage Brands</h1></div>
        <button className="btn btn-primary" onClick={() => setModal({ mode: "add", row: {} })}>+ Add Brand</button>
      </div>

      <DataTable
        columns={columns}
        rows={brands}
        searchKeys={["name", "country"]}
        onEdit={(row) => setModal({ mode: "edit", row })}
        onDelete={(row) => window.confirm(`Delete brand ${row.name}?`) && dispatch(deleteBrand(row.id))}
        emptyLabel="No brands yet."
      />

      {modal && (
        <CrudModal
          title={modal.mode === "add" ? "Add Brand" : `Edit ${modal.row.name}`}
          fields={FIELDS}
          initialValues={modal.row}
          onClose={() => setModal(null)}
          onSubmit={(values) => {
            modal.mode === "add" ? dispatch(addBrand(values)) : dispatch(updateBrand({ id: modal.row.id, ...values }));
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
