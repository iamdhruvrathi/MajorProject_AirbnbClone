const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

// Index Route
app.get("/listings", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    } catch (err) {
        console.error("Error fetching listings:", err);
        res.status(500).send("An error occurred while retrieving listings");
    }
});

// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

// Show Route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/show", { listing });
    } catch (err) {
        console.error("Error fetching listing:", err);
        res.status(500).send("An error occurred while retrieving the listing");
    }
});

// Create Route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
});

// Update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
