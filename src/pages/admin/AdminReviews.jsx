import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/admin/DataTable";
import CrudModal from "../../components/admin/CrudModal";
import { updateReview, deleteReview } from "../../features/content/contentSlice";

const FIELDS = [
  { key: "name", label: "Customer Name", required: true },
  { key: "car", label: "Car" },
  { key: "rating", label: "Rating", type: "select", options: ["5", "4", "3", "2", "1"] },
  { key: "text", label: "Review Text", type: "textarea", wide: true, required: true },
  { key: "status", label: "Status", type: "select", options: ["Published", "Hidden"] },
];

export default function AdminReviews() {
  const reviews = useSelector((s) => s.content.reviews);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null);

  const columns = [
    { key: "name", label: "Customer", sortable: true },
    { key: "car", label: "Car" },
    { key: "rating", label: "Rating", sortable: true, render: (r) => `${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}` },
    { key: "text", label: "Review", render: (r) => <span className="table-truncate">{r.text}</span> },
    { key: "status", label: "Status", render: (r) => (
      <span className={`badge ${r.status === "Published" ? "badge-live" : "badge-ignition"}`}>{r.status}</span>
    ) },
  ];

  return (
    <div>
      <div className="section-head">
        <div><span className="eyebrow">Operations</span><h1 className="fs-h1">Manage Reviews</h1></div>
      </div>

      <DataTable
        columns={columns}
        rows={reviews}
        searchKeys={["name", "car", "text"]}
        onEdit={(row) => setModal({ ...row, rating: String(row.rating) })}
        onDelete={(row) => window.confirm("Delete this review?") && dispatch(deleteReview(row.id))}
        emptyLabel="No reviews yet."
      />

      {modal && (
        <CrudModal
          title={`Edit review — ${modal.name}`}
          fields={FIELDS}
          initialValues={modal}
          onClose={() => setModal(null)}
          onSubmit={(values) => {
            dispatch(updateReview({ id: modal.id, ...values, rating: Number(values.rating) }));
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
