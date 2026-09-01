import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/admin/DataTable";
import CrudModal from "../../components/admin/CrudModal";
import { addCar, updateCar, deleteCar } from "../../features/cars/carsSlice";

const FUEL_OPTIONS = ["Petrol", "Diesel", "Electric", "Hybrid"];
const CONDITION_OPTIONS = ["New", "Used"];
const AVAILABILITY_OPTIONS = ["In Stock", "Limited Stock", "Sold Out"];
const LISTING_TYPE_OPTIONS = ["For Sale", "For Rent", "Both"];

export default function AdminCars() {
  const cars = useSelector((s) => s.cars.items);
  const brands = useSelector((s) => s.admin.brands);
  const categories = useSelector((s) => s.admin.categories);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null); // { mode: 'add'|'edit', row }

  const BRAND_OPTIONS = brands.map((b) => b.name);
  const CATEGORY_OPTIONS = categories.map((c) => c.name);

  // Built inside the component so Brand and Category dropdowns always
  // reflect the live lists from Manage Brands / Manage Categories.
  const FIELDS = [
    {
      key: "brand",
      label: "Brand",
      type: "select",
      required: true,
      options: BRAND_OPTIONS.length ? BRAND_OPTIONS : ["Add a brand first in Manage Brands"],
    },
    { key: "model", label: "Model", required: true },
    { key: "year", label: "Year", type: "number", required: true },
    {
      key: "category",
      label: "Category",
      type: "select",
      required: true,
      options: CATEGORY_OPTIONS.length ? CATEGORY_OPTIONS : ["Add a category first in Manage Categories"],
    },
    {
      key: "listingType",
      label: "Listing Type",
      type: "select",
      required: true,
      options: LISTING_TYPE_OPTIONS,
      helper: "Controls whether Buy, Rent, or both buttons show on the car's page.",
    },
    { key: "price", label: "Buy Price (USD)", type: "number", required: true },
    { key: "rentPricePerDay", label: "Rent Price / Day (USD) — leave 0 if not for rent", type: "number" },
    { key: "engine", label: "Engine" },
    { key: "transmission", label: "Transmission" },
    { key: "fuelType", label: "Fuel Type", type: "select", options: FUEL_OPTIONS },
    { key: "horsePower", label: "Horsepower", type: "number" },
    { key: "mileage", label: "Mileage (mpg-e)", type: "number" },
    { key: "color", label: "Color" },
    { key: "condition", label: "Condition", type: "select", options: CONDITION_OPTIONS },
    { key: "availability", label: "Availability", type: "select", options: AVAILABILITY_OPTIONS },
    { key: "stock", label: "Stock Quantity", type: "number" },
    { key: "image", label: "Main Image URL", wide: true },
    { key: "gallery", label: "Gallery Images (2, 3, 4...)", type: "image-list", wide: true },
    { key: "features", label: "Features (comma-separated)", type: "textarea", wide: true },
    { key: "description", label: "Description", type: "textarea", wide: true },
  ];

  const columns = [
    { key: "image", label: "", render: (r) => <img src={r.image} alt="" className="table-thumb" /> },
    { key: "model", label: "Model", sortable: true, render: (r) => <><strong>{r.brand}</strong> {r.model}</> },
    { key: "category", label: "Category", sortable: true },
    {
      key: "listingType",
      label: "Listing",
      render: (r) => <span className="badge badge-live">{r.listingType || "For Sale"}</span>,
    },
    { key: "price", label: "Buy Price", sortable: true, render: (r) => `$${Number(r.price).toLocaleString()}` },
    {
      key: "rentPricePerDay",
      label: "Rent / Day",
      render: (r) => (r.rentPricePerDay ? `$${Number(r.rentPricePerDay).toLocaleString()}` : "—"),
    },
    { key: "stock", label: "Stock", sortable: true, render: (r) => r.stock ?? "—" },
    { key: "availability", label: "Status", render: (r) => (
      <span className={`badge ${r.availability === "In Stock" ? "badge-live" : "badge-ignition"}`}>{r.availability}</span>
    ) },
  ];

  const openAdd = () => setModal({
    mode: "add",
    row: { brand: BRAND_OPTIONS[0] || "", category: CATEGORY_OPTIONS[0] || "", listingType: "For Sale" },
  });
  const openEdit = (row) => setModal({
    mode: "edit",
    row: { ...row, listingType: row.listingType || "For Sale", features: (row.features || []).join(", ") },
  });

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      features: values.features.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (modal.mode === "add") dispatch(addCar(payload));
    else dispatch(updateCar({ id: modal.row.id, ...payload }));
    setModal(null);
  };

  const handleDelete = (row) => {
    if (window.confirm(`Delete ${row.brand} ${row.model}? This can't be undone.`)) {
      dispatch(deleteCar(row.id));
    }
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <span className="eyebrow">Catalog</span>
          <h1 className="fs-h1">Manage Cars</h1>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Car</button>
      </div>

      <DataTable
        columns={columns}
        rows={cars}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchKeys={["brand", "model", "category"]}
        emptyLabel="No cars in inventory yet."
      />

      {modal && (
        <CrudModal
          title={modal.mode === "add" ? "Add New Car" : `Edit ${modal.row.brand} ${modal.row.model}`}
          fields={FIELDS}
          initialValues={modal.row}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}