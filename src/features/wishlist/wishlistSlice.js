import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ids: JSON.parse(localStorage.getItem("wishlist") || "[]"),
};

const persist = (ids) => localStorage.setItem("wishlist", JSON.stringify(ids));

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist(state, action) {
      const id = action.payload;
      state.ids = state.ids.includes(id)
        ? state.ids.filter((x) => x !== id)
        : [...state.ids, id];
      persist(state.ids);
    },
    removeFromWishlist(state, action) {
      state.ids = state.ids.filter((x) => x !== action.payload);
      persist(state.ids);
    },
  },
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export const selectIsWishlisted = (state, id) => state.wishlist.ids.includes(id);
export default wishlistSlice.reducer;
