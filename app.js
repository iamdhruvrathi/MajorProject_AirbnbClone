if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Import Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// MongoDB Connection
const dbUrl = process.env.ATLASDB_URL

mongoose
    .connect(dbUrl, { serverSelectionTimeoutMS: 5000 }) // 5-second timeout
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1); // Exit on failure
    });


// Middleware and Configurations
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("Error in Mongo Session Store", err)
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
};
app.use(session(sessionOptions));
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Middleware for Flash Messages and User
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Handle Undefined Routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error", { message });
});

// Server
app.listen(8080, () => {
    console.log("Server is running at: http://localhost:8080/listings");
});
