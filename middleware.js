const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listings");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params; //Fetching the listing:
    let listing=await Listing.findById(id);
    //owner check: 
    if(!listing.owner.equals(res.locals.currUser._id)){  // compares the owner field of the listing with res.locals.currUser._id (the current logged-in user's ID).
        req.flash("error","You are't owner of this listing ");  //not the owner, it flashes an error message and redirect
       return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,reviewId}=req.params;   // Extracting the listing ID and review ID from the route parameters
    let review=await Review.findById(reviewId); // Find the review in the database by its ID
    // Check if the review exists and whether the current user is the author
    if(!review.author.equals(res.locals.currUser._id)){  
        req.flash("error","You are't author of this review ");  
       return res.redirect(`/listings/${id}`);
    }
    next();
};

// Create Validation Middleware and function: for listing
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

// Create Validation Middleware and function: for review
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}