const Listing = require("../models/listing");
module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

//create route-4
module.exports.renderNewForm=async(req,res)=>{
    res.render("listings/new.ejs");
};

//show route
module.exports.showListing=async(req,res)=>{
    const{id}=req.params;
    const listing=await Listing.findById(id)
    .populate({   // Use populate to fetch reviews and their respective authors
        path:"reviews", // populate the reviews array
        populate:{path:"author" } // populate the author field inside each review
    })
    .populate("owner"); // populate the owner field of the listing
     // Check if the listing exists
    if(!listing){
        req.flash("error","Listings you requested for does not exits !" );
        return res.redirect("/listings"); 
    }
    res.render("listings/show.ejs",{listing});
};

//create route-4
module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path; //add to save in mongodb
    let filename=req.file.path;//add to save in mongodb
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listings Created !" );  //Set Flash Messages:
    res.redirect("/listings");
};

//update
//edit route
module.exports.renderEditForm=async(req,res)=>{
    const{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listings you requested for does not exits !" );
        return res.redirect("/listings"); 
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

//update route
module.exports.updateListing=async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!== "undefined"){
        let url=req.file.path; 
        let filename=req.file.path;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated !" );
    res.redirect(`/listings/${id}`);
};

//delete route
module.exports.destroyListing=async(req,res)=>{
    const{id}=req.params;
    const deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","New Listings Deleted !" );
    res.redirect("/listings");
};