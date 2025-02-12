const Listing = require("../models/listing");
const Review= require("../models/review");

//Post Review Route
module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id); // Find the listing by ID
    let newReview=new Review(req.body.review); // Create a new review instance using the data from the form
    newReview.author=req.user._id; // Assign the current user as the author of the review
    // console.log(newReview);
    listing.reviews.push(newReview); // Push the review into the listing's reviews array
    await newReview.save();
    await listing.save();

    req.flash("success","New Review Created !" );
    res.redirect(`/listings/${listing._id}`);
};

//Post Delete Route
module.exports.destroyReview=async(req,res)=>{
        let{id,reviewId}=req.params;  // Extracts the listing id and review id from the request parameters
        await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}}); // Remove the reviewId from the reviews array in the Listing document
        await Review.findByIdAndDelete(reviewId);// Delete the review document from the Review collection
        req.flash("success","Review Deleted !" );
        res.redirect(`/listings/${id}`);  // Redirect the user back to the listing page
};
