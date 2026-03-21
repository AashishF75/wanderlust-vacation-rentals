const Listing = require('./models/list');
const Review = require('./models/reviews');


const ExpressError = require("./utils/Expresserr");
const { listingSchema, reviewSchema } = require("./schema.js");//joi schema import

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isowner = async (req, res, next) => {
    let { id } = req.params;

    const foundListing = await Listing.findById(id);

    if (!foundListing.owner.equals(req.user._id)) {
        req.flash("error", "You are not woner!!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(errmsg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(errmsg, 400);
    } else {
        next();
    }
}



module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, revId } = req.params;   // ✅ correct param

    const review = await Review.findById(revId);

    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(req.user._id)) {   // ✅ correct user check
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};