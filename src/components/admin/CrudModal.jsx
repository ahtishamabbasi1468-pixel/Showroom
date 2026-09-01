import { useState } from "react";
import { motion } from "framer-motion";

/**
 * fields: [{ key, label, type: 'text'|'number'|'textarea'|'select'|'date'|'time'|'checkbox'|'image-list', options?, required? }]
 * initialValues: object to pre-fill (edit mode) or {} (create mode)
 *
 * type: "image-list" stores an array of image URL strings (e.g. car gallery).
 */
export default function CrudModal({ title, fields, initialValues = {}, onClose, onSubmit }) {
  const [values, setValues] = useState(() => {
    const base = {};
    fields.forEach((f) => {
      if (f.type === "image-list") {
        base[f.key] = Array.isArray(initialValues[f.key]) && initialValues[f.key].length
          ? initialValues[f.key]
          : [""];
      } else {
        base[f.key] = initialValues[f.key] ?? (f.type === "checkbox" ? false : "");
      }
    });
    return base;
  });

  const set = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const setImageAt = (key, index, val) => {
    setValues((v) => {
      const list = [...v[key]];
      list[index] = val;
      return { ...v, [key]: list };
    });
  };

  const addImageSlot = (key) => {
    setValues((v) => ({ ...v, [key]: [...v[key], ""] }));
  };

  const removeImageSlot = (key, index) => {
    setValues((v) => {
      const list = v[key].filter((_, i) => i !== index);
      return { ...v, [key]: list.length ? list : [""] };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleaned = { ...values };
    fields.forEach((f) => {
      if (f.type === "number") cleaned[f.key] = Number(cleaned[f.key]) || 0;
      if (f.type === "image-list") cleaned[f.key] = cleaned[f.key].map((s) => s.trim()).filter(Boolean);
    });
    onSubmit(cleaned);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal card admin-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex-between">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <div className="grid grid-2 admin-modal-grid">
            {fields.map((f) => (
              <div className={`field ${f.wide ? "field-wide" : ""}`} key={f.key}>
                <label htmlFor={f.key}>{f.label}</label>

                {f.type === "image-list" ? (
                  <div className="image-list-field">
                    {values[f.key].map((url, i) => (
                      <div className="image-list-row" key={i}>
                        {url ? (
                          <img src={url} alt="" className="image-list-thumb" onError={(e) => { e.target.style.visibility = "hidden"; }} />
                        ) : (
                          <div className="image-list-thumb image-list-thumb-empty" />
                        )}
                        <input
                          type="text"
                          placeholder="https://..."
                          value={url}
                          onChange={(e) => setImageAt(f.key, i, e.target.value)}
                        />
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => removeImageSlot(f.key, i)}
                          aria-label="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ marginTop: 8 }}
                      onClick={() => addImageSlot(f.key)}
                    >
                      + Add Image
                    </button>
                  </div>
                ) : f.type === "textarea" ? (
                  <textarea
                    id={f.key}
                    rows={3}
                    required={f.required}
                    value={values[f.key]}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                ) : f.type === "select" ? (
                  <select id={f.key} value={values[f.key]} onChange={(e) => set(f.key, e.target.value)}>
                    {f.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : f.type === "checkbox" ? (
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={!!values[f.key]}
                      onChange={(e) => set(f.key, e.target.checked)}
                    />
                    {f.helper || "Enabled"}
                  </label>
                ) : (
                  <input
                    id={f.key}
                    type={f.type || "text"}
                    required={f.required}
                    value={values[f.key]}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-primary btn-block">Save</button>
        </form>
      </motion.div>
    </div>
  );
}