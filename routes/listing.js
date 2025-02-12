const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const{storage}=require("../cloudConfig.js");
const upload = multer({storage});

router
 .route("/")
 .get(wrapAsync(listingController.index))   //index route
 .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));//create route-4

//create route-4
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));

router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner ,upload.single("listing[image]"), validateListing,wrapAsync(listingController.updateListing)) //update end
.delete(isLoggedIn, isOwner,wrapAsync(listingController.destroyListing))

 // //index route
// router.get("/",wrapAsync(listingController.index));



// //show route
// router.get("/:id",wrapAsync(listingController.showListing));

//create route-4
// router.post("/",validateListing,isLoggedIn,wrapAsync(listingController.createListing));

//update
//render edit form step 1
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//update the listing step2
// router.put("/:id",isLoggedIn, isOwner, validateListing,wrapAsync(listingController.updateListing)); //update end

//delete route
// router.delete("/:id",isLoggedIn, isOwner,wrapAsync(listingController.destroyListing));

module.exports=router;