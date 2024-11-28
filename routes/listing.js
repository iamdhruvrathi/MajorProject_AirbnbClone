const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


// Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

// New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new");
});

// Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created")
    res.redirect("/listings");
}));

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing, crrUser: req.user });
}));


// Edit Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist");
            return res.redirect("/listings");
        }
        res.render("listings/edit", { listing });
    }));

// Update Route
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing Updated")
        res.redirect(`/listings/${id}`);
    }));

// Delete Route
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        const deletedListing = await Listing.findByIdAndDelete(req.params.id);
        if (!deletedListing) throw new ExpressError(404, "Listing not found");
        req.flash("success", "Listing Deleted")
        res.redirect("/listings");
    }));

module.exports = router;
