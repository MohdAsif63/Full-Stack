const Listing = require("../models/listing");
const geocoder = require("../utils/geocoder");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};



module.exports.createListing = async (req, res) => {
  let url = req.file?.path;
  let filename = req.file?.filename;
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  if (url && filename) {
    newlisting.image = { url, filename };
  }

// forward geocoding
  const geoData = await geocoder.forwardGeocode(req.body.listing.location);
  newlisting.geometry = {
    type: "Point",
    coordinates: geoData.coordinates,
  };
  

  await newlisting.save();
  req.flash("success", "New Listing Created with Location!");
  res.redirect(`/listings/${newlisting._id}`);
};



module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", " Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  let orignalImageUrl = listing.image.url;
  orignalImageUrl = orignalImageUrl.replace(
    "/upload",
    "/upload/h_300,w_300,c_fill"
  );

  res.render("listings/edit.ejs", { listing, orignalImageUrl });
};


module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }

  //  Forward geocoding for updated location
  const geoData = await geocoder.forwardGeocode(req.body.listing.location);
  listing.geometry = {
    type: "Point",
    coordinates: geoData.coordinates,
  };

  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
