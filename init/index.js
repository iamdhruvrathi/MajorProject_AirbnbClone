const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://localhost:27017/wanderlust";

// Connect to MongoDB
async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");

        // Initialize the database
        await initDB();

    } catch (err) {
        console.error("Error connecting to DB or initializing data:", err);
    } finally {
        await mongoose.connection.close();
        console.log("Connection closed");
    }
}

// Initialize the database
const initDB = async () => {
    try {
        await Listing.deleteMany({});
        initData.data = initData.data.map((obj) => ({ ...obj, owner: "6747f678f55be7d7469c1c44" }));
        await Listing.insertMany(initData.data);
        console.log("Data was initialized");
    } catch (err) {
        console.error("Error initializing data:", err);
        throw err;
    }
};


main();
