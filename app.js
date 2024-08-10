const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

const app = express();

const MONGO_URL = "mongodb://localhost:27017/wanderlust";

// Function to connect to MongoDB
async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

// Call the main function to establish connection
main();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});


//Index Route
app.get("/listings", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings }); // Removed .ejs extension
    } catch (err) {
        console.error("Error fetching listings:", err);
        res.status(500).send("An error occurred while retrieving listings");
    }
});

// Show Route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;  // Correct usage of req.params
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


// Uncomment and use this route for testing Listing creation
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     });

//     try {
//         await sampleListing.save();
//         console.log("Sample was saved");
//         res.send("Successful testing");
//     } catch (err) {
//         console.log(err);
//         res.status(500).send("Error saving listing");
//     }
// });

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
