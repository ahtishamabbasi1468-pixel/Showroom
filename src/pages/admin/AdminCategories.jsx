import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/admin/DataTable";
import CrudModal from "../../components/admin/CrudModal";
import { addCategory, updateCategory, deleteCategory } from "../../features/admin/adminSlice";

const FIELDS = [
  { key: "name", label: "Category Name", required: true },
  { key: "description", label: "Description", type: "textarea", wide: true },
];

export default function AdminCategories() {
  const categories = useSelector((s) => s.admin.categories);
  const cars = useSelector((s) => s.cars.items);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null);

  const columns = [
    { key: "name", label: "Category", sortable: true },
    { key: "description", label: "Description" },
    { key: "count", label: "Cars Listed", render: (r) => cars.filter((c) => c.category === r.name).length },
  ];

  return (
    <div>
      <div className="section-head">
        <div><span className="eyebrow">Catalog</span><h1 className="fs-h1">Manage Categories</h1></div>
        <button className="btn btn-primary" onClick={() => setModal({ mode: "add", row: {} })}>+ Add Category</button>
      </div>

      <DataTable
        columns={columns}
        rows={categories}
        searchKeys={["name"]}
        onEdit={(row) => setModal({ mode: "edit", row })}
        onDelete={(row) => window.confirm(`Delete category ${row.name}?`) && dispatch(deleteCategory(row.id))}
        emptyLabel="No categories yet."
      />

      {modal && (
        <CrudModal
          title={modal.mode === "add" ? "Add Category" : `Edit ${modal.row.name}`}
          fields={FIELDS}
          initialValues={modal.row}
          onClose={() => setModal(null)}
          onSubmit={(values) => {
            modal.mode === "add" ? dispatch(addCategory(values)) : dispatch(updateCategory({ id: modal.row.id, ...values }));
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
