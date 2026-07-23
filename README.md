# MajorProject_AirbnbClone

[![Node.js](https://img.shields.io/badge/node-20.11.0-brightgreen)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-4.x-lightgrey)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-mongoose-green)](https://www.mongodb.com/)

Project Overview
----------------
A full-stack Express.js application that implements an Airbnb-like listings platform with user authentication, listing CRUD, reviews, image uploads to Cloudinary, server-side validation, and session support. It is intended for developers/interviewers to review a working web app demonstrating common web patterns (authentication, file upload, form validation, MVC-style organization).

Tech Stack
----------
- Language: JavaScript (Node.js)
- Framework / Runtime: Express 4 (Node.js 20.11.0)
- Templating: EJS + ejs-mate
- Database: MongoDB (Mongoose)
- Authentication: Passport (passport-local + passport-local-mongoose)
- File upload/storage: multer + multer-storage-cloudinary + Cloudinary
- Validation: Joi
- Session store: connect-mongo (sessions persisted to MongoDB)
- Other notable libs: express-session, connect-flash, method-override

What this repo actually contains
-------------------------------
- User auth (register / login/logout) using passport-local and passport-local-mongoose (models/user.js + passport setup in app.js).
- Listings model and associated CRUD capabilities (models/listing.js, routes mounted at /listings).
- Reviews model and review validation + review routes mounted under /listings/:id/reviews.
- Image upload integration with Cloudinary (cloudConfig.js + multer-storage-cloudinary).
- Server-side request validation using Joi schemas (schema.js).
- Session persistence in MongoDB and flash messages (express-session + connect-mongo + connect-flash).
- Views rendered with EJS templates (views/).
- Middleware for authentication, authorization, and request validation (middleware.js).
- Centralized error helper (utils/ExpressError.js).

Folder structure (top-level)
----------------------------
```text
.
├─ app.js                      # Application entrypoint, middleware & route mounting
├─ package.json                # Node engines, dependencies, scripts
├─ cloudConfig.js              # Cloudinary + multer-storage-cloudinary setup
├─ schema.js                   # Joi validation schemas for listings & reviews
├─ middleware.js               # auth/authorization & validation middleware
├─ utils/
│  └─ ExpressError.js          # custom Error class
├─ models/
│  ├─ user.js                  # User schema & passport-local-mongoose plugin
│  ├─ listing.js               # Listing schema (image, price, location, owner, reviews)
│  └─ review.js?               # (review model referenced; reviews are used throughout)
├─ routes/
│  ├─ listing.js               # mounted at /listings
│  ├─ review.js                # mounted at /listings/:id/reviews
│  └─ user.js                  # auth routes (register/login/logout) mounted at /
├─ controllers/                # (request handlers; controllers folder present)
├─ views/                      # EJS templates for pages (rendered by routes)
├─ public/                     # static assets (CSS/JS/images)
├─ vercel.json                 # deployment config
└─ init/                       # init scripts or helper resources
```

Architecture (MVC)
------------------
- Models: Mongoose models in models/ (User, Listing, Review). Listing includes image metadata and references to Review documents and an owner reference to User.
- Views: EJS templates in views/ render pages (server-side rendered UI).
- Controllers/Routes: routes/ (listing.js, review.js, user.js) define endpoints, and controllers/ holds business logic (request handlers) invoked by routes.
- Middleware: middleware.js contains reusable middleware for:
  - isLoggedIn (requires auth),
  - saveRedirectUrl (persist return URL),
  - isOwner (listing ownership check),
  - isReviewAuthor (review ownership check),
  - validateListing / validateReview (Joi validation).
- Other cross-cutting: cloudConfig.js handles Cloudinary storage; express-session + connect-mongo manage sessions.

How it fits together (runtime flow)
----------------------------------
When a user visits the app, Express routes in routes/ handle requests. Listings routes (mounted at /listings) serve index/show/new/create/edit/update/delete flows, using middleware.js for validation and auth checks. Reviews are nested under listings and are validated by Joi. Image uploads are processed with multer-storage-cloudinary and stored on Cloudinary. Passport handles login/register flows and session serialization. Views are rendered with EJS.

Installation
------------
Clone, install dependencies, set environment variables (see next section), then start.

Commands:
```bash
# clone
git clone https://github.com/iamdhruvrathi/MajorProject_AirbnbClone.git
cd MajorProject_AirbnbClone

# install
npm install

# start (development)
npm start
# The app listens on port 8080 by default
# Visit http://localhost:8080/listings
```

Environment variables
---------------------
Create a .env (or set env vars in your environment). The app references:

- ATLASDB_URL         — MongoDB connection string (used by mongoose & connect-mongo)
- SECRET              — session secret (used for express-session and connect-mongo crypto secret)
- CLOUD_NAME          — Cloudinary cloud name
- CLOUD_API_KEY       — Cloudinary API key
- CLOUD_API_SECRET    — Cloudinary API secret
- NODE_ENV            — set to "production" in production (optional)

Example .env:
```bash
ATLASDB_URL=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/airbnb_clone?retryWrites=true&w=majority
SECRET=your_session_secret_here
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
NODE_ENV=development
```

Usage
-----
- Start the server: npm start
- Open: http://localhost:8080/listings
- Typical flows implemented (based on code):
  - Register a new user / Login (passport-local)
  - Create a new listing (with image upload to Cloudinary)
  - View a listing's details and reviews
  - Add a review to a listing (rating + comment validated by Joi)
  - Edit / Delete a listing (ownership enforced)
  - Delete reviews (only review author allowed)
  - Flash messages notify success/error
  - Sessions persisted in MongoDB

Author
------
Dhruv Rathi (GitHub: @iamdhruvrathi) 
