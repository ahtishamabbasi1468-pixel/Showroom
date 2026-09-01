# Firebase Integration — Setup Guide

Ye project ab poori tarah Firebase se connected hai: **Authentication** (register/login/forgot
password), aur **Firestore** (cars, showroom catalog, bookings, ratings, registered users — sab
kuch admin panel se manage hota hai aur live site pe reflect hota hai).

## 1. `.env` banao

```
cp .env.example .env
```

Firebase Console → Project Settings → General → Your apps → SDK setup and configuration se ye
values copy karke `.env` mein paste karo:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## 2. Firebase Console mein enable karo

1. **Authentication → Sign-in method** → "Email/Password" enable karo.
2. **Firestore Database → Create database** → production mode, apne nearest region ke saath.
3. **Firestore → Rules** tab kholo, is repo ki `firestore.rules` file ka pura content paste kar
   ke **Publish** karo. (Ye control karta hai ke public site sirf read kar sake, aur sirf Admin
   role wale users hi catalog/admin data write kar sakein.)

Blaze plan ki zaroorat **nahi** hai — sab kuch free Spark plan ke andar chalta hai (Cloud
Functions/email-OTP wala hissa is scope mein shamil nahi hai).

## 3. Install & run

```
npm install
npm run dev
```

## 4. Apna pehla Admin account banao

Firebase Auth mein har account by default `role: "Customer"` ke saath banta hai — koi bhi seedha
"Admin" nahi ban sakta (security ke liye).

1. Site kholo → **/register** → normal account bana lo (apna naam/email/phone/password).
2. Firebase Console → **Firestore Database** → `users` collection → apne naye account ka document
   dhoondo (uid se) → `role` field ko `"Customer"` se `"Admin"` kar do.
3. Ab isi email/password se **/admin/login** pe login ho jayega.

Isi tareeqe se future mein kisi bhi customer ko staff/admin banaya ja sakta hai — Admin panel ke
**Users** section se bhi role edit ho sakta hai (jab tak wo document already ban chuka ho).

## 5. Starter catalog data (optional)

Naya Firestore project khaali hota hai. Do options hain:

- **Manual**: Admin panel se khud Brands/Categories/Cars/Services add kar lo.
- **Script se seed**: `.env` mein do lines add karo —
  ```
  SEED_ADMIN_EMAIL=you@example.com
  SEED_ADMIN_PASSWORD=your-password
  ```
  (isi account se jo Step 4 mein Admin banaya tha), phir:
  ```
  npm run seed
  ```
  Ye ek chhota starter set (brands, categories, 1 sample car, services, packages, reviews, blogs)
  Firestore mein daal dega. Dobara run mat karna warna duplicate ho jayega.

## Kya kaam karta hai ab

- **Register** (`/register`) — real Firebase Auth account banata hai (email + password), phone
  number Firestore mein customer profile ke saath save hota hai.
- **Login** (`/login`) — real Firebase Auth.
- **Forgot Password** (`/forgot-password`) — Firebase ka built-in password-reset **link** email
  pe bhejta hai (code-based OTP is scope se bahar rakha gaya hai, jaisa aapne kaha tha).
- **Admin → Users** — har naya registered customer yahan (naam + email) turant dikhta hai.
- **Car ratings** — Car Details page pe logged-in customer star-rating de sakta hai; average
  rating aur review count automatically update hota hai.
- **Admin panel** — Brands, Categories, Cars, Services, Packages, Blogs, Reviews, Customers,
  Staff, Users, Bookings, Notifications, Showroom Settings — sab Firestore-backed hain aur public
  site pe turant reflect hote hain.
- **Test Drive / Service bookings** — customer jab book karta hai, real booking Firestore mein
  ban ke Admin → Bookings mein turant dikhti hai, aur customer apne Dashboard → Bookings tab mein
  bhi dekh sakta hai.

## Skip kiya gaya (jaisa aapne bola)

- Email/phone **code-based OTP verification** — iske liye Cloud Functions + Blaze plan + koi email
  provider (Resend/SendGrid) chahiye hoti. Agar future mein chahiye ho to bata dena, alag se add
  kar denge.
