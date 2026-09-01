export default function RatingStars({ rating, reviews }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <div className="rating-stars" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="star">
          {i < full ? "★" : i === full && half ? "⯪" : "☆"}
        </span>
      ))}
      <span className="rating-value mono">{rating.toFixed(1)}</span>
      {reviews != null && <span className="rating-count">({reviews})</span>}
    </div>
  );
}
