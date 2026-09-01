import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Tilt3D from "./Tilt3D";
import RatingStars from "./RatingStars";
import { toggleWishlist, selectIsWishlisted } from "../../features/wishlist/wishlistSlice";

export default function CarCard({ car, index = 0 }) {
  const dispatch = useDispatch();
  const wishlisted = useSelector((state) => selectIsWishlisted(state, car.id));

  const listingType = car.listingType || "For Sale";
  const canBuy = listingType === "For Sale" || listingType === "Both";
  const canRent = listingType === "For Rent" || listingType === "Both";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3), ease: [0.16, 1, 0.3, 1] }}
    >
      <Tilt3D className="car-card" strength={6}>
        <Link to={`/cars/${car.id}`} className="car-card-link">
          <div className="car-card-media">
            <img src={car.image} alt={`${car.brand} ${car.model}`} loading="lazy" />
            <span className={`badge ${car.availability === "In Stock" ? "badge-live" : "badge-ignition"} car-card-availability`}>
              {car.availability}
            </span>
            <button
              className={`wishlist-btn ${wishlisted ? "is-active" : ""}`}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={(e) => {
                e.preventDefault();
                dispatch(toggleWishlist(car.id));
              }}
            >
              {wishlisted ? "♥" : "♡"}
            </button>
          </div>
          <div className="car-card-body">
            <div className="flex-between">
              <span className="eyebrow" style={{ marginBottom: 0 }}>{car.brand}</span>
              <span className="mono text-muted" style={{ fontSize: "var(--fs-xs)" }}>{car.year}</span>
            </div>
            <h3 className="car-card-title">{car.model}</h3>
            <RatingStars rating={car.rating} reviews={car.reviews} />
            <div className="car-card-specs">
              <span>{car.horsePower} hp</span>
              <span className="dot">·</span>
              <span>{car.transmission}</span>
              <span className="dot">·</span>
              <span>{car.fuelType}</span>
            </div>
            <div className="car-card-footer">
              <div>
                {canBuy && (
                  <span className="mono car-card-price">${Number(car.price).toLocaleString()}</span>
                )}
                {canRent && (
                  <span
                    className="mono text-muted"
                    style={{ display: "block", fontSize: "var(--fs-xs)", marginTop: canBuy ? 2 : 0 }}
                  >
                    ${Number(car.rentPricePerDay || 0).toLocaleString()}/day rent
                  </span>
                )}
              </div>
              <span className="btn btn-primary btn-sm">View Details</span>
            </div>
          </div>
        </Link>
      </Tilt3D>
    </motion.div>
  );
}