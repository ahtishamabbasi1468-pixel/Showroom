# Ignis Motors — Smart Car Showroom (Frontend)

Frontend-only build of the showroom portfolio project. No Tailwind — all styling
is hand-written CSS using a design-token system (`src/styles/tokens.css`) built
around an automotive dashboard theme (graphite/asphalt background, ignition-orange
+ volt-cyan accents). The signature interaction is `Tilt3D` — a perspective/tilt
wrapper with a moving light glare, used on car cards, the hero art, and the
auth showcase panels for a subtle "showroom under one light" 3D feel.

## Stack

- React 19 + Vite
- React Router DOM (routing)
- Redux Toolkit (cars/filters, auth, wishlist state)
- Axios (pre-wired with JWT + refresh-token interceptors, pointed at a
  not-yet-built ASP.NET Core API — see below)
- Framer Motion (page/section reveal + the Tilt3D interaction)
- Plain CSS, no CSS framework

## Run it

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## What's implemented

- Public pages: Home, Cars (search/filter/sort/pagination), Car Details
  (gallery, specs, features, test-drive modal), About, Services (+ packages,
  booking modal), Finance Calculator (EMI, save calculation), Blogs, Reviews
  (with add-review form), Contact
- Auth pages: Login, Register, Forgot Password — currently mocked in
  `src/features/auth/authSlice.js` (stores a fake user in localStorage)
- Customer area: Wishlist, Dashboard (profile, bookings, notifications,
  settings tabs) — all backed by mock/local data in `src/data/carsData.js`
- Dark/light theme toggle, toast notifications, skeleton loaders, responsive
  layout down to mobile, visible keyboard focus, `prefers-reduced-motion`
  respected

## Admin Panel

A full admin console lives at `/admin` (guarded — visit `/admin/login` first).

**Demo login:** `admin@ignismotors.example` / any password (mock auth, see below).

Sections: Dashboard (KPIs + charts), Cars, Inventory, Brands, Categories,
Services, Service Packages, Customers, Staff, Users, Bookings, Reviews,
Blogs, Notifications, Analytics, Settings — every one with add/edit/delete
via a shared `DataTable` + `CrudModal` component pair
(`src/components/admin/`).

Admin edits are **live**: cars, services, packages, reviews and blogs are
all read from Redux on the public site too, so adding/editing/deleting in
the admin panel immediately shows up on Home, Cars, Car Details, Services,
Reviews, Blogs, and Wishlist.

State lives in three slices: `features/cars/carsSlice.js` (cars + stock),
`features/services/servicesSlice.js` (services + packages),
`features/content/contentSlice.js` (reviews + blogs), and
`features/admin/adminSlice.js` (brands, categories, customers, staff,
users, bookings, notifications, showroom settings).

## Wiring up the backend later

Everything that will eventually hit the ASP.NET Core API is already isolated:

- `src/api/axios.js` — base client with JWT attach + refresh-token retry flow.
  Point `VITE_API_BASE_URL` at your API (`.env` file, not committed).
- `src/features/*/*.js` — each Redux slice has comments marking where a mock
  action (`loginSuccess`, saved EMI, etc.) should become a real API call via
  `createAsyncThunk` + the axios client.
- `src/data/carsData.js` — swap this static import for API-fetched data once
  `GET /api/cars`, `/api/services`, `/api/reviews`, `/api/blogs` exist; the
  shape of each object already matches what the components expect.
- Google Maps: `src/pages/Contact.jsx` has a `.map-placeholder` marked for the
  Google Maps JS API mount point once a key is available.
- Image uploads (profile photo, car images): Dashboard "My Profile" and a
  future Staff/Admin panel are the two places Cloudinary's widget will attach.

## Not yet built (by design — backend comes next)

Staff and Admin dashboards, real authentication/authorization, nearby-places
(petrol pumps, EV charging, etc. via Google Places), notifications backend,
and persistence beyond localStorage.
