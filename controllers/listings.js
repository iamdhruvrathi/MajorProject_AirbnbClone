const Listing = require("../models/listing")


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
}

module.exports.showListing = async (req, res) => {
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
    console.log(listing.image.url);
    res.render("listings/show", { listing, crrUser: req.user });
}

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload/h_250");
    res.render("listings/edit", {
        listing,
        originalImageUrl
    });
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated successfully.");
    res.redirect(`/listings/${id}`);
}

module.exports.destroylisting = async (req, res) => {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);
    if (!deletedListing) throw new ExpressError(404, "Listing not found.");
    req.flash("success", "Listing deleted successfully.");
    res.redirect("/listings");
}