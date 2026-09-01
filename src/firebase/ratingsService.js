import { collection, doc, getDocs, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import { COLLECTIONS, carRatingsCol } from "./collections";

/**
 * Submit (or update) the current user's rating for a car, then recompute
 * that car's average `rating` and `reviews` count so the numbers shown
 * across the site stay consistent.
 *
 * Note: Firestore's web-SDK transactions only support reading specific doc
 * refs (not queries), so the average is recomputed with a plain read +
 * write. Good enough for a rating counter — for very high concurrent write
 * volume this could be moved to a Cloud Function trigger instead.
 */
export async function rateCar({ carId, uid, value, comment = "", userName = "Customer" }) {
  const ratingRef = doc(db, ...carRatingsCol(carId).split("/"), uid);
  const carRef = doc(db, COLLECTIONS.CARS, carId);

  await setDoc(ratingRef, { value, comment, userName, createdAt: new Date().toISOString() });

  const ratingsSnap = await getDocs(collection(db, carRatingsCol(carId)));
  const values = ratingsSnap.docs.map((d) => d.data().value);
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;

  await updateDoc(carRef, { rating: Math.round(avg * 10) / 10, reviews: values.length });

  return { rating: value };
}

export async function fetchCarRatings(carId) {
  const snap = await getDocs(collection(db, carRatingsCol(carId)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchUserRatingForCar(carId, uid) {
  const snap = await getDoc(doc(db, ...carRatingsCol(carId).split("/"), uid));
  return snap.exists() ? snap.data() : null;
}
