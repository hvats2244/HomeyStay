const express = require("express");
const router = express.Router({mergeParams:true}); //(mergeParams ka  use tab krta jab parent ka paramter use krna ho child m )
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");


const reviewController = require("../controller/review.js");
const review = require("../models/review.js");


//Reviews
//reviews ka post route

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
 
 
 //review ka Delete Route
 
 router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview)
 );
 
 module.exports = router;
 