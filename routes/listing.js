const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const { isLoggedIn, isowner, validateListing } = require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");
const multer = require('multer')
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage })
// const upload = multer({ dest: 'uploads/' })

router.route("/")
    .get(wrapAsync(listingcontroller.index))
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingcontroller.createlisting))


router.get("/new", isLoggedIn, listingcontroller.rendernewform);

// Search listings
router.get("/search", wrapAsync(listingcontroller.searchListing));

router.route("/:id")
    .put(isLoggedIn, isowner, upload.single("listing[image]"), validateListing, wrapAsync(listingcontroller.updatelisting))
    .delete(isLoggedIn, isowner, wrapAsync(listingcontroller.deletelisting))
    .get(wrapAsync(listingcontroller.showlisting))
// index


// new


// create

// edit
router.get("/:id/edit", isLoggedIn, isowner, wrapAsync(listingcontroller.editlisting));

// update

// delete

// show


module.exports = router;