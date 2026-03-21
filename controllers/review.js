const listing = require("../models/list");
const Review = require("../models/reviews");

module.exports.postreview = async (req, res) => {
    console.log("Logged in user:", req.user.username);
    let foundlisting = await listing.findById(req.params.id);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    foundlisting.reviews.push(newReview);

    await newReview.save();
    await foundlisting.save();
    req.flash("success", "new Review adedd!!");


    res.redirect(`/listings/${req.params.id}`);
}


module.exports.deletereview = async (req, res) => {
    let { id, revId } = req.params;

    await listing.findByIdAndUpdate(id, {
        $pull: { reviews: revId }
    });

    await Review.findByIdAndDelete(revId);
    req.flash("success", "Review deleted!!");

    res.redirect(`/listings/${id}`);
}