import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeCrudThunks, attachCrudReducers } from "../../firebase/crudThunks";
import { COLLECTIONS, SHOWROOM_SETTINGS_DOC } from "../../firebase/collections";
import { fetchDocById, setDocById, removeDoc } from "../../firebase/firestoreService";

// ---- Standard CRUD thunks per collection ----
const brands = makeCrudThunks("brands", COLLECTIONS.BRANDS);
const categories = makeCrudThunks("categories", COLLECTIONS.CATEGORIES);
const customers = makeCrudThunks("customers", COLLECTIONS.CUSTOMERS);
const staff = makeCrudThunks("staff", COLLECTIONS.STAFF);
// `users` is written to automatically on Firebase sign-up (see firebase/authService.js
// -> registerUser); admin can additionally edit role/status or add staff/admin profiles here.
const users = makeCrudThunks("users", COLLECTIONS.USERS);
const bookings = makeCrudThunks("bookings", COLLECTIONS.BOOKINGS);
const notifications = makeCrudThunks("notifications", COLLECTIONS.NOTIFICATIONS);

export const fetchBrands = brands.fetchAllThunk;
export const addBrand = brands.addThunk;
export const updateBrand = brands.updateThunk;
export const deleteBrand = brands.removeThunk;

export const fetchCategories = categories.fetchAllThunk;
export const addCategory = categories.addThunk;
export const updateCategory = categories.updateThunk;
export const deleteCategory = categories.removeThunk;

export const fetchCustomers = customers.fetchAllThunk;
export const addCustomer = customers.addThunk;
export const updateCustomer = customers.updateThunk;
export const deleteCustomer = customers.removeThunk;

export const fetchStaff = staff.fetchAllThunk;
export const addStaff = staff.addThunk;
export const updateStaff = staff.updateThunk;
export const deleteStaff = staff.removeThunk;

// Registered users list — this is what makes new sign-ups show up in the admin panel.
export const fetchUsers = users.fetchAllThunk;
export const addUser = users.addThunk;
export const updateUser = users.updateThunk;
export const deleteUser = users.removeThunk;

export const fetchBookings = bookings.fetchAllThunk;
export const addBooking = bookings.addThunk;
// Same shape as the generic update thunk ({ id, status }) — kept as its own
// export so AdminBookings.jsx's existing `updateBookingStatus({ id, status })`
// calls keep working unchanged.
export const updateBookingStatus = bookings.updateThunk;
export const deleteBooking = bookings.removeThunk;

export const fetchNotifications = notifications.fetchAllThunk;
export const addNotification = notifications.addThunk;
export const deleteNotification = notifications.removeThunk;

// Deletes a person from BOTH `users` and `customers` at once (same uid in
// both, since signup writes to both — see authService.js -> registerUser).
// Works whichever admin screen starts the delete — Manage Users or Manage
// Customers — so the two lists never go out of sync with each other.
export const deleteUserEverywhere = createAsyncThunk(
  "admin/deleteUserEverywhere",
  async (id) => {
    await Promise.all([
      removeDoc(COLLECTIONS.USERS, id).catch(() => {}),
      removeDoc(COLLECTIONS.CUSTOMERS, id).catch(() => {}),
    ]);
    return id;
  }
);

// ---- Showroom settings: a single document, not a collection ----
const defaultShowroom = {
  name: "Ignis Motors",
  address: "",
  phone: "",
  email: "",
  hours: "",
  lat: 33.6007,
  lng: 73.0679,
  facebook: "",
  instagram: "",
  youtube: "",
};

export const fetchShowroom = createAsyncThunk("admin/fetchShowroom", async () => {
  const doc = await fetchDocById(COLLECTIONS.SETTINGS, SHOWROOM_SETTINGS_DOC);
  return doc || defaultShowroom;
});

export const updateShowroom = createAsyncThunk("admin/updateShowroom", async (changes) => {
  return setDocById(COLLECTIONS.SETTINGS, SHOWROOM_SETTINGS_DOC, changes);
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    brands: [],
    categories: [],
    customers: [],
    staff: [],
    users: [],
    bookings: [],
    notifications: [],
    showroom: defaultShowroom,
    status: "idle", // becomes "loaded" once the admin console's first bootstrap fetch finishes
  },
  reducers: {},
  extraReducers: (builder) => {
    attachCrudReducers(builder, brands, "brands");
    attachCrudReducers(builder, categories, "categories");
    attachCrudReducers(builder, customers, "customers");
    attachCrudReducers(builder, staff, "staff");
    attachCrudReducers(builder, users, "users");
    attachCrudReducers(builder, bookings, "bookings");
    // notifications has no "update" action in the UI — attach fetch/add/remove only.
    builder
      .addCase(notifications.fetchAllThunk.fulfilled, (state, action) => {
        state.notifications = action.payload;
      })
      .addCase(notifications.addThunk.fulfilled, (state, action) => {
        state.notifications.unshift(action.payload);
      })
      .addCase(notifications.removeThunk.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter((n) => n.id !== action.payload);
      })
      .addCase(fetchShowroom.fulfilled, (state, action) => {
        state.showroom = action.payload;
      })
      .addCase(updateShowroom.fulfilled, (state, action) => {
        state.showroom = { ...state.showroom, ...action.payload };
      })
      .addCase(deleteUserEverywhere.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.customers = state.customers.filter((c) => c.id !== action.payload);
      });
  },
});

export default adminSlice.reducer;