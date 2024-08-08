const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const app = express();

const MONGO_URL = "mongodb+srv://dhruv2005rathi:p7T9EnFivMcQ3P31@cluster0.a7rrg.mongodb.net/myDatabase?retryWrites=true&w=majority";

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch(err => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute, Goa",
        country: "India"
    });

    try {
        await sampleListing.save();
        console.log("Sample was saved");
        res.send("Successful testing");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving listing");
    }
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
