import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAll, createDoc, patchDoc, removeDoc } from "../../firebase/firestoreService";
import { COLLECTIONS } from "../../firebase/collections";
import { rateCar as rateCarService } from "../../firebase/ratingsService";

const initialState = {
  items: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  filters: {
    search: "",
    category: "All",
    brand: "All",
    minPrice: 0,
    maxPrice: 100000,
    sort: "featured",
  },
};

export const fetchCars = createAsyncThunk("cars/fetchCars", async () => {
  return fetchAll(COLLECTIONS.CARS, { orderByField: "createdAt" });
});

export const addCar = createAsyncThunk("cars/addCar", async (payload) => {
  return createDoc(COLLECTIONS.CARS, {
    rating: 0,
    reviews: 0,
    stock: 1,
    gallery: payload.image ? [payload.image] : [],
    ...payload,
  });
});

export const updateCar = createAsyncThunk("cars/updateCar", async ({ id, ...changes }) => {
  return patchDoc(COLLECTIONS.CARS, id, changes);
});

export const deleteCar = createAsyncThunk("cars/deleteCar", async (id) => {
  await removeDoc(COLLECTIONS.CARS, id);
  return id;
});

export const setStock = createAsyncThunk("cars/setStock", async ({ id, stock }) => {
  return patchDoc(COLLECTIONS.CARS, id, { stock });
});

/** Customer submits/updates their star rating for a car. */
export const rateCar = createAsyncThunk(
  "cars/rateCar",
  async ({ carId, uid, value, comment, userName }, { rejectWithValue }) => {
    try {
      await rateCarService({ carId, uid, value, comment, userName });
      // Re-read the car so `rating`/`reviews` reflect the new average.
      const cars = await fetchAll(COLLECTIONS.CARS, { orderByField: "createdAt" });
      const updated = cars.find((c) => c.id === carId);
      return updated;
    } catch (err) {
      return rejectWithValue(err?.message || "Rating submit nahi ho saki");
    }
  }
);

const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.filters.search = action.payload;
    },
    setCategory(state, action) {
      state.filters.category = action.payload;
    },
    setBrand(state, action) {
      state.filters.brand = action.payload;
    },
    setPriceRange(state, action) {
      state.filters.minPrice = action.payload.min;
      state.filters.maxPrice = action.payload.max;
    },
    setSort(state, action) {
      state.filters.sort = action.payload;
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addCar.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        const i = state.items.findIndex((c) => c.id === action.payload.id);
        if (i !== -1) state.items[i] = { ...state.items[i], ...action.payload };
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      })
      .addCase(setStock.fulfilled, (state, action) => {
        const car = state.items.find((c) => c.id === action.payload.id);
        if (car) car.stock = action.payload.stock;
      })
      .addCase(rateCar.fulfilled, (state, action) => {
        if (!action.payload) return;
        const i = state.items.findIndex((c) => c.id === action.payload.id);
        if (i !== -1) state.items[i] = { ...state.items[i], ...action.payload };
      });
  },
});

export const {
  setSearch, setCategory, setBrand, setPriceRange, setSort, resetFilters,
} = carsSlice.actions;

export const selectFilteredCars = (state) => {
  const { items, filters } = state.cars;
  let result = items.filter((car) => {
    const matchesSearch =
      !filters.search ||
      `${car.brand} ${car.model}`.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === "All" || car.category === filters.category;
    const matchesBrand = filters.brand === "All" || car.brand === filters.brand;
    const matchesPrice = car.price >= filters.minPrice && car.price <= filters.maxPrice;
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  switch (filters.sort) {
    case "price-asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result = [...result].sort((a, b) => b.rating - a.rating);
      break;
    case "year":
      result = [...result].sort((a, b) => b.year - a.year);
      break;
    default:
      break;
  }
  return result;
};

export default carsSlice.reducer;
