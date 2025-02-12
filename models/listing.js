const mongoose = require("mongoose");
const Schema = mongoose.Schema; //s a constructor provided by Mongoose to define the structure of documents in a collection.
const Review = require("./review.js");

const listingSchema = new Schema({  //A schema defines the structure of your data.
  title: {
    type: String,
    required: true,
  },
  description: String,
  image:{
    url:String,
    filename:String,
  },
  
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({ _id: {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema); // A model is like a template for documents in a collection,
module.exports = Listing; //The model is exported for use in other files.
