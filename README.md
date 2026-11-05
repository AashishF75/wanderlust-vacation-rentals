# Wanderlust — Full-Stack Vacation Rental Marketplace

An end-to-end web application inspired by Airbnb, designed for browsing, booking, hosting, and reviewing vacation rental accommodations across global destinations.

---

## 1. Project Overview

**Wanderlust** is a monolithic web platform built with **Node.js, Express.js, MongoDB, and EJS**. It provides travelers with an interactive property discovery experience featuring dynamic category filtering, destination search, and Mapbox geospatial visualizations, while empowering property owners to publish and manage listings with cloud-optimized media storage powered by Cloudinary.

---

## 2. Problem Statement

Modern travel platforms require seamless media uploads, low-latency search, robust user authentication, and interactive map visualizations. Wanderlust implements these core production requirements within an accessible, maintainable **Model-View-Controller (MVC)** server-side rendered architecture.

---

## 3. Key Features

- **Property Listings & Showcase:** Browse vacation rentals with high-definition imagery, formatted pricing in INR, tax-toggle calculation, and host information.
- **Geocoding & Interactive Maps:** Location queries are forward-geocoded into GeoJSON points using the Mapbox SDK; listing details render interactive Mapbox GL JS maps with custom markers.
- **Cloud Media Uploads:** Property images uploaded through multipart forms are validated, processed by Multer, and stored in Cloudinary with automated format optimization.
- **Destination Search:** Real-time regex search across property titles, locations, and countries.
- **Dynamic Category Filtering:** One-click filtering across categories: *Trending, Room, City, Mountain, Cottage, Pool, Farms, Camping, Arctic, Doms, Sailboats*.
- **Review & Rating System:** Guests can leave star ratings (1–5 stars) using Starability CSS controls and detailed commentary.
- **User Authentication & Authorization:** Session-based authentication via Passport.js with PBKDF2 hashing. Strict authorization guards ensure only listing owners and review authors can edit or delete their respective resources.
- **Cascade Deletion:** Mongoose post-hooks automatically clean up all associated reviews when a property listing is deleted.

---

## 4. Technology Stack

- **Backend:** Node.js (v18+ / v24.x), Express.js (v5.2.1)
- **Database & ODM:** MongoDB Community Server (v8.x) / MongoDB Atlas, Mongoose (v9.2.1)
- **Session Management:** `express-session`, `connect-mongo` (v4.6.0)
- **Authentication:** Passport.js, `passport-local`, `passport-local-mongoose`
- **View Engine:** EJS, `ejs-mate` (Layouts & Partials)
- **UI Framework & Styling:** Bootstrap 5.3.8, FontAwesome 7.0.1, custom CSS, Starability CSS
- **Geospatial & Maps:** `@mapbox/mapbox-sdk` (Backend geocoding), Mapbox GL JS (Frontend maps)
- **File Upload & Cloud Storage:** Multer, `multer-storage-cloudinary`, Cloudinary SDK v2
- **Validation:** Joi (Schema validation middleware)

---

## 5. Project Architecture

The application adheres to the classic **Model-View-Controller (MVC)** architectural pattern:

```
                      +-------------------+
                      |   Client Browser  |
                      +---------+---------+
                                | HTTP Requests (GET, POST, PUT, DELETE)
                                v
                      +-------------------+
                      |   Express Router  |
                      +---------+---------+
                                |
             +------------------+------------------+
             | Route Middleware (Auth, Validation) |
             +------------------+------------------+
                                |
                                v
                      +-------------------+
                      |    Controllers    | <---> [ Mapbox & Cloudinary SDKs ]
                      +---------+---------+
                                |
                   +------------+------------+
                   |                         |
                   v                         v
         +-------------------+     +-------------------+
         |  Mongoose Models  |     |   EJS Templates   |
         |  (Data Layer)     |     |   (View Layer)    |
         +---------+---------+     +---------+---------+
                   |                         |
                   v                         v
         +-------------------+     +-------------------+
         | MongoDB Database  |     | HTML / CSS Output |
         +-------------------+     +-------------------+
```

---

## 6. Folder Structure

```
c:\alone_project\
├── app.js                   # Application entry point, server configuration, middleware chain
├── cloudconfig.js           # Cloudinary SDK & Multer Cloudinary storage setup
├── middleware.js            # Route authorization guards & Joi validation middleware
├── schema.js                # Joi validation schemas (listingSchema, reviewSchema)
├── controllers/             # Business logic controllers
│   ├── listing.js           # Property listing CRUD & search controller
│   ├── review.js            # Reviews CRUD controller
│   └── user.js              # Authentication (signup, login, logout) controller
├── models/                  # Mongoose data schemas
│   ├── list.js              # Listing model (GeoJSON, image, reviews reference)
│   ├── reviews.js           # Review model (Rating, comment, author reference)
│   └── user.js              # User model with passport-local-mongoose plugin
├── routes/                  # Express REST route endpoints
│   ├── listing.js           # /listings routes
│   ├── review.js            # /listings/:id/reviews routes
│   └── user.js              # Auth routes (/signup, /login, /logout)
├── views/                   # Server-rendered EJS templates
│   ├── err.ejs              # Global error presentation view
│   ├── includes/            # Partials (navbar.ejs, footer.ejs, flash.ejs)
│   ├── layouts/             # Master boilerplate layout (boilerplate.ejs)
│   ├── listings/            # Listing views (index.ejs, show.ejs, new.ejs, edit.ejs)
│   └── users/               # Authentication views (login.ejs, signup.ejs)
├── public/                  # Static assets
│   ├── css/                 # style.css, rating.css
│   └── js/                  # map.js (Mapbox GL client), script.js (Form validation)
├── scripts/                 # Utility and maintenance scripts
│   ├── seedDatabase.js      # Safe, idempotent sample data seeder
│   └── testSuite.js         # Automated functional test runner
├── package.json             # NPM package manifest & scripts
└── .env.example             # Template for required environment variables
```

---

## 7. Installation Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x, v20.x, or v24.x)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (running locally on port 27017 or a MongoDB Atlas URI)
- Free accounts on [Mapbox](https://account.mapbox.com/) and [Cloudinary](https://cloudinary.com/)

### Step 1: Clone Repository & Install Dependencies
```bash
git clone <your-repository-url>
cd alone_project
npm install
```

---

## 8. Environment Variable Setup

Copy the `.env.example` template to `.env`:

```bash
# On Windows PowerShell:
Copy-Item .env.example .env

# On Linux / macOS:
cp .env.example .env
```

Open `.env` in your editor and configure your credentials:

```env
# Database Configuration
ATLAS_URI=mongodb://127.0.0.1:27017/wunderlust

# Mapbox Configuration
MAP_TOKEN=your_mapbox_public_token_here

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Server & Session Configuration (Optional)
PORT=8080
SECRET=your_super_secret_session_key_here
```

---

## 9. MongoDB Configuration

- **Local MongoDB (Default):** Ensure your local MongoDB service is running:
  ```powershell
  # Windows PowerShell
  Get-Service -Name MongoDB
  # To start if stopped:
  Start-Service -Name MongoDB
  ```
  Set `ATLAS_URI=mongodb://127.0.0.1:27017/wunderlust`.
- **MongoDB Atlas (Cloud):** Set `ATLAS_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/wunderlust?retryWrites=true&w=majority`.

---

## 10. Cloudinary Configuration

1. Create a free account at [Cloudinary](https://cloudinary.com/).
2. On your **Dashboard**, locate your **Product Environment Credentials**.
3. Copy **Cloud Name**, **API Key**, and **API Secret** into `.env`.
4. Ensure your API Key has **Master / Full Access** permissions in **Settings &rarr; API Keys** so uploads are permitted.

---

## 11. Mapbox Configuration

1. Create a free account at [Mapbox](https://account.mapbox.com/).
2. From your account dashboard, copy the **Default public token** (starts with `pk.eyJ...`).
3. Paste into `.env` under `MAP_TOKEN`.

---

## 12. Database Seeding Instructions

Populate the database with 18 realistic vacation rental listings and an initial host account:

```bash
npm run seed
```

*Note: The seeder is idempotent; running it multiple times safely detects and skips duplicates without dropping existing data.*

---

## 13. How to Run the Project

### Development Mode (with hot-reloading)
```bash
npm run dev
```

### Standard Production Mode
```bash
npm start
```

### Automated Functional Test Suite
```bash
npm test
```

Access the application in your browser:
- **Explore Listings:** [http://localhost:8080/listings](http://localhost:8080/listings)
- **User Login:** [http://localhost:8080/login](http://localhost:8080/login)
- **User Signup:** [http://localhost:8080/signup](http://localhost:8080/signup)
- **Create Listing:** [http://localhost:8080/listings/new](http://localhost:8080/listings/new)

---

## 14. Demo Login Credentials

> [!NOTE]
> These credentials are for **local development and testing purposes only**:
- **Username:** `demo`
- **Password:** `Demo@12345`
- **Email:** `demo@wanderlust.local`

---

## 15. Application Screenshots

| Listings Catalog & Filters | Listing Detail & Interactive Mapbox Map |
|:---:|:---:|
| *(Add your screenshot here: `assets/catalog.png`)* | *(Add your screenshot here: `assets/show.png`)* |

| Property Creation with Cloudinary | Mobile Responsive View |
|:---:|:---:|
| *(Add your screenshot here: `assets/create.png`)* | *(Add your screenshot here: `assets/mobile.png`)* |

---

## 16. Future Enhancements

- [ ] Online booking reservation system with calendar date-picker.
- [ ] Stripe / PayPal payment gateway integration.
- [ ] User profile pages with hosting analytics.
- [ ] Real-time guest-host messaging via Socket.IO.
- [ ] Wishlist and favorite properties collection.

---

## License

This project is licensed under the [ISC License](LICENSE).

