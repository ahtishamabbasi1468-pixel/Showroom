import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/admin/DataTable";
import CrudModal from "../../components/admin/CrudModal";
import { addBlog, updateBlog, deleteBlog } from "../../features/content/contentSlice";

const FIELDS = [
  { key: "title", label: "Title", required: true, wide: true },
  { key: "author", label: "Author" },
  { key: "status", label: "Status", type: "select", options: ["Published", "Draft"] },
  { key: "excerpt", label: "Excerpt", type: "textarea", wide: true, required: true },
];

export default function AdminBlogs() {
  const blogs = useSelector((s) => s.content.blogs);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null);

  const columns = [
    { key: "title", label: "Title", sortable: true },
    { key: "author", label: "Author" },
    { key: "date", label: "Date", sortable: true },
    { key: "status", label: "Status", render: (r) => (
      <span className={`badge ${r.status === "Published" ? "badge-live" : ""}`}>{r.status}</span>
    ) },
  ];

  return (
    <div>
      <div className="section-head">
        <div><span className="eyebrow">Operations</span><h1 className="fs-h1">Manage Blogs</h1></div>
        <button className="btn btn-primary" onClick={() => setModal({ mode: "add", row: { author: "Admin", status: "Published" } })}>+ New Post</button>
      </div>

      <DataTable
        columns={columns}
        rows={blogs}
        searchKeys={["title", "author"]}
        onEdit={(row) => setModal({ mode: "edit", row })}
        onDelete={(row) => window.confirm(`Delete "${row.title}"?`) && dispatch(deleteBlog(row.id))}
        emptyLabel="No blog posts yet."
      />

      {modal && (
        <CrudModal
          title={modal.mode === "add" ? "New Blog Post" : `Edit "${modal.row.title}"`}
          fields={FIELDS}
          initialValues={modal.row}
          onClose={() => setModal(null)}
          onSubmit={(values) => {
            modal.mode === "add"
              ? dispatch(addBlog({ ...values, date: new Date().toISOString().slice(0, 10) }))
              : dispatch(updateBlog({ id: modal.row.id, ...values }));
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
