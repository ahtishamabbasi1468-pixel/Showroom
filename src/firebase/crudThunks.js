import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAll, createDoc, patchDoc, removeDoc } from "./firestoreService";

/**
 * Generates the standard fetch/add/update/remove thunks for a Firestore
 * collection so every admin-managed entity (brands, categories, customers,
 * staff, bookings, reviews, blogs, services, packages, notifications…)
 * doesn't need to hand-write the same four async thunks.
 *
 * Usage:
 *   const t = makeCrudThunks("brands", COLLECTIONS.BRANDS);
 *   export const fetchBrands = t.fetchAllThunk;
 *   export const addBrand = t.addThunk;
 *   export const updateBrand = t.updateThunk;
 *   export const deleteBrand = t.removeThunk;
 */
export function makeCrudThunks(name, collectionName, { orderByField = "createdAt" } = {}) {
  const fetchAllThunk = createAsyncThunk(`${name}/fetchAll`, async () => {
    return fetchAll(collectionName, orderByField ? { orderByField } : {});
  });

  const addThunk = createAsyncThunk(`${name}/add`, async (payload) => {
    return createDoc(collectionName, payload);
  });

  const updateThunk = createAsyncThunk(`${name}/update`, async ({ id, ...changes }) => {
    return patchDoc(collectionName, id, changes);
  });

  const removeThunk = createAsyncThunk(`${name}/remove`, async (id) => {
    await removeDoc(collectionName, id);
    return id;
  });

  return { fetchAllThunk, addThunk, updateThunk, removeThunk };
}

/** Wires the standard fulfilled-cases for a set of CRUD thunks onto a slice's `builder`. */
export function attachCrudReducers(builder, { fetchAllThunk, addThunk, updateThunk, removeThunk }, stateKey) {
  builder
    .addCase(fetchAllThunk.fulfilled, (state, action) => {
      state[stateKey] = action.payload;
    })
    .addCase(addThunk.fulfilled, (state, action) => {
      state[stateKey].unshift(action.payload);
    })
    .addCase(updateThunk.fulfilled, (state, action) => {
      const i = state[stateKey].findIndex((x) => x.id === action.payload.id);
      if (i !== -1) state[stateKey][i] = { ...state[stateKey][i], ...action.payload };
    })
    .addCase(removeThunk.fulfilled, (state, action) => {
      state[stateKey] = state[stateKey].filter((x) => x.id !== action.payload);
    });
}
