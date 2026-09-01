// Central place for Firestore collection names so they never get
// typo'd differently across slices.
export const COLLECTIONS = {
  USERS: "users",
  CARS: "cars",
  BRANDS: "brands",
  CATEGORIES: "categories",
  CUSTOMERS: "customers",
  STAFF: "staff",
  BOOKINGS: "bookings",
  NOTIFICATIONS: "notifications",
  REVIEWS: "reviews",
  BLOGS: "blogs",
  SERVICES: "services",
  PACKAGES: "packages",
  SETTINGS: "settings",
};

// Ratings are stored as a subcollection under each car:
//   cars/{carId}/ratings/{userId}  ->  { value, comment, userName, createdAt }
// One doc per user per car (doc id = uid) so a user can only rate once,
// and re-rating just overwrites their previous rating.
export const carRatingsCol = (carId) => `${COLLECTIONS.CARS}/${carId}/ratings`;

export const SHOWROOM_SETTINGS_DOC = "showroom";

// Home page content (hero copy, stats, marquee brands) — single document,
// lives inside the same SETTINGS collection as the showroom doc.
export const HOME_CONTENT_DOC = "home";