import { configureStore } from "@reduxjs/toolkit";
import carsReducer from "../features/cars/carsSlice";
import authReducer from "../features/auth/authSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import servicesReducer from "../features/services/servicesSlice";
import contentReducer from "../features/content/contentSlice";
import adminReducer from "../features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    cars: carsReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    services: servicesReducer,
    content: contentReducer,
    admin: adminReducer,
  },
});
