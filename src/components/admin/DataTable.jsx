import { useMemo, useState } from "react";

/**
 * columns: [{ key, label, render?(row), sortable? }]
 * rows: array of records (must have `id`)
 * onEdit / onDelete: optional row action handlers
 */
export default function DataTable({ columns, rows, onEdit, onDelete, searchKeys = [], emptyLabel = "No records yet" }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    let result = rows;
    if (search && searchKeys.length) {
      const q = search.toLowerCase();
      result = result.filter((row) => searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(q)));
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
        return sortDir === "asc"
          ? String(av ?? "").localeCompare(String(bv ?? ""))
          : String(bv ?? "").localeCompare(String(av ?? ""));
      });
    }
    return result;
  }, [rows, search, sortKey, sortDir, searchKeys]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <div className="admin-table-wrap card">
      {searchKeys.length > 0 && (
        <div className="admin-table-toolbar">
          <input
            className="admin-search-input"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="text-muted mono" style={{ fontSize: "var(--fs-xs)" }}>{filtered.length} of {rows.length}</span>
        </div>
      )}
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} onClick={() => col.sortable && toggleSort(col.key)} className={col.sortable ? "is-sortable" : ""}>
                  {col.label}
                  {col.sortable && sortKey === col.key && <span className="sort-arrow">{sortDir === "asc" ? " ▲" : " ▼"}</span>}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="actions-col">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="admin-table-empty text-muted">{emptyLabel}</td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="actions-col">
                      <div className="row-actions">
                        {onEdit && <button className="btn btn-ghost btn-sm" onClick={() => onEdit(row)}>Edit</button>}
                        {onDelete && <button className="btn btn-ghost btn-sm danger" onClick={() => onDelete(row)}>Delete</button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
