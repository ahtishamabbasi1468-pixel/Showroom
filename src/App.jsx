import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import About from "./pages/About";
import Services from "./pages/Services";
import FinanceCalculator from "./pages/FinanceCalculator";
import Blogs from "./pages/Blogs";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Wishlist from "./pages/Wishlist";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

import AdminLayout, { ProtectedAdminRoute } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCars from "./pages/admin/AdminCars";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminBrands from "./pages/admin/AdminBrands";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminServices from "./pages/admin/AdminServices";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

import { watchAuthState } from "./firebase/authService";
import { syncAuthFromFirebase } from "./features/auth/authSlice";
import { fetchCars } from "./features/cars/carsSlice";
import { fetchBrands, fetchCategories, fetchCustomers, fetchStaff, fetchUsers, fetchBookings, fetchNotifications, fetchShowroom } from "./features/admin/adminSlice";
import { fetchServices, fetchPackages } from "./features/services/servicesSlice";
import { fetchReviews, fetchBlogs, fetchHomeContent } from "./features/content/contentSlice";

export default function App() {
  const dispatch = useDispatch();

  // Keep Redux in sync with Firebase's own auth state (handles page refresh,
  // token expiry, and multi-tab logins) — this is what authSlice.authReady waits on.
  useEffect(() => {
    const unsubscribe = watchAuthState((firebaseUser) => {
      dispatch(syncAuthFromFirebase(firebaseUser));
    });
    return unsubscribe;
  }, [dispatch]);

  // One-time bootstrap of every collection the public site reads from, so
  // Home/Cars/CarDetails/Services/Blogs/Reviews all show live Firestore data
  // instead of the old static mock arrays.
  useEffect(() => {
    dispatch(fetchCars());
    dispatch(fetchBrands());
    dispatch(fetchCategories());
    dispatch(fetchServices());
    dispatch(fetchPackages());
    dispatch(fetchReviews());
    dispatch(fetchBlogs());
    dispatch(fetchHomeContent());
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/finance" element={<FinanceCalculator />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<ProtectedAdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/cars" element={<AdminCars />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/brands" element={<AdminBrands />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/packages" element={<AdminPackages />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/staff" element={<AdminStaff />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/blogs" element={<AdminBlogs />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}