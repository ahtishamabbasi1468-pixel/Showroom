import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeCrudThunks, attachCrudReducers } from "../../firebase/crudThunks";
import { COLLECTIONS, HOME_CONTENT_DOC } from "../../firebase/collections";
import { fetchDocById, setDocById } from "../../firebase/firestoreService";

const reviews = makeCrudThunks("reviews", COLLECTIONS.REVIEWS);
const blogs = makeCrudThunks("blogs", COLLECTIONS.BLOGS);

export const fetchReviews = reviews.fetchAllThunk;
export const addReview = reviews.addThunk;
export const updateReview = reviews.updateThunk;
export const deleteReview = reviews.removeThunk;

export const fetchBlogs = blogs.fetchAllThunk;
export const addBlog = blogs.addThunk;
export const updateBlog = blogs.updateThunk;
export const deleteBlog = blogs.removeThunk;

// ---- Home page content: a single document, not a collection ----
const defaultHomeContent = {
  eyebrow: "Showroom · Est. Rawalpindi",
  titleLine1: "Every car here has",
  titleLine2: "already been",
  titleAccent: "driven hard.",
  subtitle:
    "Not by us — by the engineers who built them. Browse a curated inventory, book a test drive in two taps, and finance it before you leave the page.",
  heroImage:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  heroSpecs: [
    { label: "0–100 km/h", value: "3.9s" },
    { label: "Top Speed", value: "312 km/h" },
    { label: "Range", value: "320 mi" },
  ],
  gaugeValue: "421",
  gaugeLabel: "HP",
  stats: [
    { label: "Cars Delivered", value: "4,280+" },
    { label: "Avg. Delivery Time", value: "3.2 days" },
    { label: "Service Centers", value: "12" },
    { label: "Customer Rating", value: "4.8 / 5" },
  ],
  marqueeBrands: ["ASTER", "KESTREL", "VELON", "NORRLAND", "ORION", "HALCYON"],
};

export const fetchHomeContent = createAsyncThunk("content/fetchHomeContent", async () => {
  const doc = await fetchDocById(COLLECTIONS.SETTINGS, HOME_CONTENT_DOC);
  return doc || defaultHomeContent;
});

export const updateHomeContent = createAsyncThunk(
  "content/updateHomeContent",
  async (changes) => {
    return setDocById(COLLECTIONS.SETTINGS, HOME_CONTENT_DOC, changes);
  }
);

const contentSlice = createSlice({
  name: "content",
  initialState: {
    reviews: [],
    blogs: [],
    homeContent: defaultHomeContent,
  },
  reducers: {},
  extraReducers: (builder) => {
    attachCrudReducers(builder, reviews, "reviews");
    attachCrudReducers(builder, blogs, "blogs");
    builder
      .addCase(fetchHomeContent.fulfilled, (state, action) => {
        state.homeContent = action.payload;
      })
      .addCase(updateHomeContent.fulfilled, (state, action) => {
        state.homeContent = { ...state.homeContent, ...action.payload };
      });
  },
});

export default contentSlice.reducer;