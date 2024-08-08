const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://dhruv2005rathi:p7T9EnFivMcQ3P31@cluster0.a7rrg.mongodb.net/myDatabase?retryWrites=true&w=majority";

// Connect to MongoDB
async function main() {
    try {
        await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to DB");
        
        // Initialize the database
        await initDB();
    } catch (err) {
        console.error("Error connecting to DB or initializing data:", err);
    } finally {
        mongoose.connection.close();
    }
}

// Initialize the database
const initDB = async () => {
    try {
        await Listing.deleteMany({});
        await Listing.insertMany(initData.data);
        console.log("Data was initialized");
    } catch (err) {
        console.error("Error initializing data:", err);
    }
};

// Start the process
main();
