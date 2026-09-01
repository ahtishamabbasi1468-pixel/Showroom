import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateShowroom } from "../../features/admin/adminSlice";
import { updateHomeContent } from "../../features/content/contentSlice";
import { useToast } from "../../components/common/Toast";

export default function AdminSettings() {
  const showroom = useSelector((s) => s.admin.showroom);
  const home = useSelector((s) => s.content.homeContent);
  const dispatch = useDispatch();
  const toast = useToast();

  const [form, setForm] = useState(showroom);
  const [homeForm, setHomeForm] = useState({
    avgDeliveryTime: home.avgDeliveryTime,
    serviceCenters: home.serviceCenters,
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setHome = (key, val) => setHomeForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateShowroom(form));
    toast?.("Showroom settings saved", "success");
  };

  const handleHomeSubmit = (e) => {
    e.preventDefault();
    dispatch(updateHomeContent(homeForm));
    toast?.("Home page stats saved", "success");
  };

  return (
    <div>
      <div className="section-head">
        <div><span className="eyebrow">Insights</span><h1 className="fs-h1">Showroom Settings</h1></div>
      </div>

      <form onSubmit={handleSubmit} className="card admin-settings-form">
        <h3>General information</h3>
        <div className="grid grid-2">
          <div className="field"><label htmlFor="s-name">Showroom Name</label><input id="s-name" value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div className="field"><label htmlFor="s-phone">Phone</label><input id="s-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
          <div className="field"><label htmlFor="s-email">Email</label><input id="s-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
          <div className="field"><label htmlFor="s-hours">Working Hours</label><input id="s-hours" value={form.hours} onChange={(e) => set("hours", e.target.value)} /></div>
        </div>
        <div className="field"><label htmlFor="s-address">Address</label><input id="s-address" value={form.address} onChange={(e) => set("address", e.target.value)} /></div>

        <h3 style={{ marginTop: 24 }}>Google Map location</h3>
        <div className="grid grid-2">
          <div className="field"><label htmlFor="s-lat">Latitude</label><input id="s-lat" type="number" step="0.0001" value={form.lat} onChange={(e) => set("lat", Number(e.target.value))} /></div>
          <div className="field"><label htmlFor="s-lng">Longitude</label><input id="s-lng" type="number" step="0.0001" value={form.lng} onChange={(e) => set("lng", Number(e.target.value))} /></div>
        </div>

        <h3 style={{ marginTop: 24 }}>Social links</h3>
        <div className="grid grid-3">
          <div className="field"><label htmlFor="s-fb">Facebook</label><input id="s-fb" value={form.facebook} onChange={(e) => set("facebook", e.target.value)} /></div>
          <div className="field"><label htmlFor="s-ig">Instagram</label><input id="s-ig" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} /></div>
          <div className="field"><label htmlFor="s-yt">YouTube</label><input id="s-yt" value={form.youtube} onChange={(e) => set("youtube", e.target.value)} /></div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }}>Save Settings</button>
      </form>

      <form onSubmit={handleHomeSubmit} className="card admin-settings-form" style={{ marginTop: "var(--space-5)" }}>
        <h3>Home page stats</h3>
        <p className="text-muted" style={{ marginBottom: 16 }}>
          Cars Delivered and Customer Rating are calculated live from bookings and reviews.
          These two are business facts you set manually.
        </p>
        <div className="grid grid-2">
          <div className="field">
            <label htmlFor="h-delivery">Avg. Delivery Time</label>
            <input id="h-delivery" value={homeForm.avgDeliveryTime} onChange={(e) => setHome("avgDeliveryTime", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="h-centers">Service Centers</label>
            <input id="h-centers" value={homeForm.serviceCenters} onChange={(e) => setHome("serviceCenters", e.target.value)} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }}>Save Home Stats</button>
      </form>
    </div>
  );
}