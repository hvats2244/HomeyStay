// routes folder  ko structure format m represent krna k liya iska use krta h 
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");


const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController = require("../controller/listing.js");

//form ka data ko parse krna k liya multer ka use krta h .
const multer  = require('multer')
const{storage}=require("../cloudConfig.js")
const upload = multer({storage })//multer jo bhi file aya gi usko storage m save kra dega .

//jinka common path h but get ,post ,etc  different h to unko router.route compact form m likna k liya help krta h. 
router.route("/")
.get(wrapAsync(listingController.index)) //index route(all listings show hoti h isa )
.post(isLoggedIn, upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));//create route


//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing))//show route
.put(isLoggedIn,isOwner, upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))//update route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));//Delete route

    




//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));








module.exports = router;