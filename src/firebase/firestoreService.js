import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

/** Fetch every document in a collection as plain objects with `id`. */
export async function fetchAll(colName, { orderByField, direction = "desc" } = {}) {
  const colRef = collection(db, colName);
  const q = orderByField ? query(colRef, orderBy(orderByField, direction)) : colRef;
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Add a new document with an auto-generated id, returns the created object. */
export async function createDoc(colName, data) {
  const payload = { ...data, createdAt: serverTimestamp() };
  const ref = await addDoc(collection(db, colName), payload);
  return { id: ref.id, ...data, createdAt: new Date().toISOString() };
}

/** Create/overwrite a document at a known id (e.g. a Firebase Auth uid). */
export async function setDocById(colName, id, data) {
  await setDoc(doc(db, colName, id), { ...data, createdAt: serverTimestamp() }, { merge: true });
  return { id, ...data };
}

/** Patch fields on an existing document. */
export async function patchDoc(colName, id, data) {
  await updateDoc(doc(db, colName, id), data);
  return { id, ...data };
}

/** Delete a document. */
export async function removeDoc(colName, id) {
  await deleteDoc(doc(db, colName, id));
  return id;
}

/** Read a single document by id (e.g. the one-off "showroom" settings doc). */
export async function fetchDocById(colName, id) {
  const snap = await getDoc(doc(db, colName, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export { serverTimestamp };
