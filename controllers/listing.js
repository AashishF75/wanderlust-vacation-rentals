const Listing = require("../models/list")
const mxbGeocoading = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mxbGeocoading({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    let { category } = req.query;
    let filter = {};
    if (category) {
        filter.category = category;
    }
    const alllistings = await Listing.find(filter);
    res.render("listings/index.ejs", { alllistings, category });
}

module.exports.searchListing = async (req, res) => {
    let { q } = req.query;
    if (!q || !q.trim()) {
        return res.redirect("/listings");
    }
    const query = q.trim();
    const alllistings = await Listing.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } },
            { country: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    });
    if (alllistings.length === 0) {
        req.flash("error", `No listings found matching "${query}"`);
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs", { alllistings, category: null });
};

module.exports.rendernewform = (req, res) => {

    res.render("listings/new.ejs");

}

module.exports.createlisting = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send();




    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {
        url,
        filename
    }
    newlisting.geometry = response.body.features[0].geometry;
    let savedListing = await newlisting.save();
    console.log(savedListing);
    req.flash("success", "new listing created!");
    res.redirect("/listings");

}


module.exports.editlisting = async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id);
    if (!listings) {
        req.flash("error", "listings you requested dose not exit!!  ");
        return res.redirect("/listings");

    }
    let originalImageurl = listings.image.url;
    originalImageurl = originalImageurl.replace("/upload", "/upload/w_200");

    res.render("listings/edit.ejs", { listings, originalImageurl });
}

module.exports.updatelisting = async (req, res) => {
    let { id } = req.params;
    const updatedata = await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true, new: true });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedata.image = {
            url,
            filename
        }
        await updatedata.save();
    }


    req.flash("success", "listing updated");
    res.redirect("/listings");
}

module.exports.deletelisting = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing Deleted!");
    res.redirect("/listings");
}

module.exports.showlisting = async (req, res) => {
    let { id } = req.params;

    const listings = await Listing.findById(id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        });

    if (!listings) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", {
        listings,
        MAP_TOKEN: process.env.MAP_TOKEN   // ✅ ADD THIS LINE
    });
}