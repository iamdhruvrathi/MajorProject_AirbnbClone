const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js")

const app = express();
const MONGO_URL = "mongodb://localhost:27017/wanderlust";

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

main();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Routes
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }
    else {
        next();
    }
}

// Index Route
app.get("/listings", wrapAsync(async (req, res, next) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    } catch (err) {
        next(err);
    }
}));

// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).send("Listing not found");
        res.render("listings/show", { listing });
    } catch (err) {
        next(err);
    }
}));

// Create Route
app.post("/listings",
    validateListing,
    wrapAsync(async (req, res, next) => {

        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    }));

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).send("Listing not found");
        res.render("listings/edit", { listing });
    } catch (err) {
        next(err);
    }
}));

// Update Route
app.put("/listings/:id",
    validateListing,
    wrapAsync(async (req, res, next) => {
        if (!req.body.listing) {
            throw new ExpressError(400, "Send valid data for listing");
        }
        try {
            const listing = await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
            if (!listing) return res.status(404).send("Listing not found");
            res.redirect(`/listings/${req.params.id}`);
        } catch (err) {
            next(err);
        }
    }));

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res, next) => {
    try {
        const deletedListing = await Listing.findByIdAndDelete(req.params.id);
        if (!deletedListing) return res.status(404).send("Listing not found");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
}));

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error", { message });
});

// Server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
