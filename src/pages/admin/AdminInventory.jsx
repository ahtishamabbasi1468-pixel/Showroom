import { useSelector, useDispatch } from "react-redux";
import { setStock, updateCar } from "../../features/cars/carsSlice";

export default function AdminInventory() {
  const cars = useSelector((s) => s.cars.items);
  const dispatch = useDispatch();

  const adjust = (car, delta) => {
    const next = Math.max(0, (car.stock ?? 0) + delta);
    dispatch(setStock({ id: car.id, stock: next }));
    if (next === 0) dispatch(updateCar({ id: car.id, availability: "Sold Out" }));
    else if (car.availability === "Sold Out") dispatch(updateCar({ id: car.id, availability: "In Stock" }));
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <span className="eyebrow">Catalog</span>
          <h1 className="fs-h1">Inventory Levels</h1>
        </div>
      </div>

      <div className="card admin-table-wrap">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr><th></th><th>Model</th><th>Stock</th><th>Status</th><th>Adjust</th></tr>
            </thead>
            <tbody>
              {cars.map((c) => (
                <tr key={c.id}>
                  <td><img src={c.image} alt="" className="table-thumb" /></td>
                  <td><strong>{c.brand}</strong> {c.model}</td>
                  <td className="mono">{c.stock ?? 0} units</td>
                  <td>
                    <span className={`badge ${c.availability === "In Stock" ? "badge-live" : "badge-ignition"}`}>{c.availability}</span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => adjust(c, -1)}>− Remove</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => adjust(c, 1)}>+ Restock</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
