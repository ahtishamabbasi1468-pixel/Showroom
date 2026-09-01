import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";
import { COLLECTIONS } from "./collections";

/** Human-readable messages for the Firebase Auth error codes we actually hit. */
export function friendlyAuthError(err) {
  const code = err?.code || "";
  const map = {
    "auth/email-already-in-use": "Ye email pehle se registered hai. Login try karein.",
    "auth/invalid-email": "Email address theek se likhein.",
    "auth/weak-password": "Password kam se kam 6 characters ka hona chahiye.",
    "auth/user-not-found": "Ye account nahi mila.",
    "auth/wrong-password": "Password galat hai.",
    "auth/invalid-credential": "Email ya password galat hai.",
    "auth/too-many-requests": "Bohat zyada attempts ho gaye — thodi der baad try karein.",
    "auth/network-request-failed": "Network error — internet check karein.",
  };
  return map[code] || err?.message || "Kuch ghalat ho gaya, dobara try karein.";
}

/**
 * Register a new customer: creates the Firebase Auth account, sets their
 * displayName, and writes a matching profile document to users/{uid} so the
 * admin panel's Users list and role-based login both work.
 *
 * It also mirrors the same person into customers/{uid} — same doc id as the
 * uid — so they immediately show up in Manage Customers without any extra
 * admin action. Both documents are kept in sync going forward whenever the
 * admin edits either one, since they share the same id.
 */
export async function registerUser({ name, email, phone, password }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });

  const joined = new Date().toISOString().slice(0, 10);

  const profile = {
    name,
    email,
    phone: phone || "",
    role: "Customer",
    status: "Active",
  };
  await setDoc(doc(db, COLLECTIONS.USERS, cred.user.uid), {
    ...profile,
    joined,
    createdAt: serverTimestamp(),
  });

  // Mirror into `customers` so Manage Customers shows every sign-up automatically.
  await setDoc(doc(db, COLLECTIONS.CUSTOMERS, cred.user.uid), {
    name,
    email,
    phone: phone || "",
    status: "Active",
    joined,
    bookings: 0,
    createdAt: serverTimestamp(),
  });

  return { uid: cred.user.uid, ...profile };
}

/** Log in and return the merged auth + Firestore profile (includes role). */
export async function loginUser({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const profile = await fetchUserProfile(cred.user.uid);
  return {
    uid: cred.user.uid,
    email: cred.user.email,
    name: profile?.name || cred.user.displayName || cred.user.email.split("@")[0],
    phone: profile?.phone || "",
    role: profile?.role || "Customer",
    status: profile?.status || "Active",
  };
}

export async function logoutUser() {
  await signOut(auth);
}

/** Native Firebase password-reset email (link-based). */
export async function requestPasswordReset(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function fetchUserProfile(uid) {
  const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
  return snap.exists() ? snap.data() : null;
}

/** Subscribe to Firebase's own auth-state changes (page refresh, etc). */
export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}