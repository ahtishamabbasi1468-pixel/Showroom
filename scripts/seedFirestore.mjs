/**
 * One-time seed script — pushes the original demo catalog (cars, brands,
 * categories, services, reviews, blogs) into your Firestore project so the
 * site isn't empty on first run.
 *
 * Usage:
 *   1. Fill in .env (VITE_FIREBASE_* keys) as usual.
 *   2. Register a normal account once via the site's /register page, then in
 *      the Firebase Console open Firestore -> users/{that uid} and change its
 *      "role" field to "Admin". That's now your seed/admin account.
 *   3. Add two more lines to your .env:
 *        SEED_ADMIN_EMAIL=you@example.com
 *        SEED_ADMIN_PASSWORD=your-password
 *   4. Run:  npm run seed
 *
 * Safe to re-run — it only *adds* documents (Firestore auto-generates new
 * ids each time), so running it twice will duplicate the catalog. Delete
 * the collections in the Firebase Console first if you want a clean re-seed.
 */
import { readFileSync, existsSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// ---- tiny .env loader (no extra dependency needed) ----
function loadEnv() {
  if (!existsSync(".env")) return;
  const lines = readFileSync(".env", "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnv();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Missing VITE_FIREBASE_* values in .env — copy .env.example to .env and fill it in first.");
  process.exit(1);
}
if (!process.env.SEED_ADMIN_EMAIL || !process.env.SEED_ADMIN_PASSWORD) {
  console.error("Missing SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD in .env — see the comment at the top of this script.");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const BRANDS = [
  { name: "Aster", country: "Italy", founded: 1962, carsListed: 1, status: "Active" },
  { name: "Kestrel", country: "UK", founded: 1978, carsListed: 1, status: "Active" },
  { name: "Velon", country: "USA", founded: 2011, carsListed: 1, status: "Active" },
  { name: "Norrland", country: "Sweden", founded: 1954, carsListed: 1, status: "Active" },
  { name: "Orion", country: "Japan", founded: 1969, carsListed: 1, status: "Active" },
  { name: "Halcyon", country: "Germany", founded: 1931, carsListed: 1, status: "Active" },
];

const CATEGORIES = [
  { name: "Sedan", description: "Four-door passenger cars with a separate trunk." },
  { name: "SUV", description: "Higher ground clearance, larger cabin, AWD options." },
  { name: "Coupe", description: "Two-door performance-leaning body style." },
  { name: "Electric", description: "Battery-electric drivetrains." },
  { name: "Hatchback", description: "Compact body with a rear liftgate." },
];

const CARS = [
  {
    brand: "Aster", model: "Meridian GT", year: 2025, category: "Coupe", price: 68500,
    engine: "3.0L Twin-Turbo V6", transmission: "8-Speed Auto", fuelType: "Petrol",
    horsePower: 421, mileage: 22, color: "Graphite Grey", condition: "New", availability: "In Stock",
    rating: 4.8, reviews: 34,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
    ],
    features: ["Adaptive Cruise Control", "Carbon Ceramic Brakes", "Heads-Up Display", "Sport Exhaust", "Premium Audio"],
    description: "The Meridian GT pairs a twin-turbo V6 with a chassis tuned for the apex. Built for drivers who read corners before they arrive.",
    stock: 3,
  },
];

const SERVICES = [
  { name: "Oil Change", duration: "30 min", price: 45 },
  { name: "Engine Repair", duration: "2-4 hrs", price: 220 },
  { name: "AC Repair", duration: "1-2 hrs", price: 130 },
  { name: "Wheel Alignment", duration: "45 min", price: 65 },
  { name: "Battery Replacement", duration: "30 min", price: 150 },
  { name: "Brake Service", duration: "1 hr", price: 110 },
  { name: "Car Wash", duration: "20 min", price: 25 },
  { name: "Car Detailing", duration: "3 hrs", price: 180 },
  { name: "Denting & Painting", duration: "1-2 days", price: 350 },
];

const PACKAGES = [
  { name: "Essential Care", price: 89, items: "Oil Change, Multi-point Inspection, Tire Rotation" },
  { name: "Complete Care", price: 189, items: "Oil Change, Brake Service, AC Check, Battery Test, Wheel Alignment" },
  { name: "Premium Detail", price: 249, items: "Full Detailing, Ceramic Coating Touch-up, Interior Deep Clean, Engine Bay Clean" },
];

const REVIEWS = [
  { name: "Ayesha Raza", car: "Velon Pulse EV", rating: 5, text: "Delivery was on time and the showroom team walked me through every feature before I drove off the lot.", status: "Published" },
  { name: "Bilal Ahmed", car: "Aster Meridian GT", rating: 5, text: "Test drive booking online was effortless — picked a slot, showed up, and the car was already pulled up front.", status: "Published" },
  { name: "Sana Malik", car: "Kestrel Ranger X", rating: 4, text: "Great buying experience overall. Service scheduling through the app has saved me a lot of phone calls.", status: "Published" },
];

const BLOGS = [
  { title: "EV Range Anxiety: What 2026 Batteries Actually Deliver", date: "2026-06-02", excerpt: "We tested five electric drivetrains across mixed terrain to see how real-world range holds up against the sticker number.", author: "Admin", status: "Published" },
  { title: "Manual vs Automatic in 2026: Is Rowing Your Own Still Worth It", date: "2026-05-18", excerpt: "Dual-clutch gearboxes are faster than any human. So why do enthusiasts still ask for three pedals?", author: "Admin", status: "Published" },
  { title: "A Buyer's Guide to Certified Pre-Owned Inspections", date: "2026-04-30", excerpt: "What a 150-point inspection actually checks, and the five things you should verify yourself before signing.", author: "Admin", status: "Published" },
];

async function seedCollection(name, docs) {
  for (const d of docs) {
    await addDoc(collection(db, name), { ...d, createdAt: serverTimestamp() });
  }
  console.log(`  ✓ ${docs.length} doc(s) -> ${name}`);
}

async function main() {
  console.log("Signing in as", process.env.SEED_ADMIN_EMAIL, "…");
  await signInWithEmailAndPassword(auth, process.env.SEED_ADMIN_EMAIL, process.env.SEED_ADMIN_PASSWORD);

  console.log("Seeding Firestore…");
  await seedCollection("brands", BRANDS);
  await seedCollection("categories", CATEGORIES);
  await seedCollection("cars", CARS);
  await seedCollection("services", SERVICES);
  await seedCollection("packages", PACKAGES);
  await seedCollection("reviews", REVIEWS);
  await seedCollection("blogs", BLOGS);

  console.log("Done. Open the site — the catalog should now be live.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err.message || err);
  process.exit(1);
});
