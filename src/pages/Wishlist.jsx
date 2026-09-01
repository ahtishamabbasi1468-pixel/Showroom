import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CarCard from "../components/common/CarCard";

export default function Wishlist() {
  const ids = useSelector((s) => s.wishlist.ids);
  const cars = useSelector((s) => s.cars.items).filter((c) => ids.includes(c.id));

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Saved</span>
            <h1 className="fs-h1">Your wishlist</h1>
          </div>
        </div>

        {cars.length === 0 ? (
          <div className="empty-state card">
            <h3>Your wishlist is empty</h3>
            <p className="text-muted">Tap the heart on any car to save it here.</p>
            <Link to="/cars" className="btn btn-primary btn-sm">Browse Cars</Link>
          </div>
        ) : (
          <div className="grid grid-3">
            {cars.map((car, i) => <CarCard car={car} key={car.id} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}
