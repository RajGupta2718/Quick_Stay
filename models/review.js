const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default: Date.now(), //The timestamp when the review is created, defaulting to the current time.
    },
    author: {
        type: Schema.Types.ObjectId,  // Store the ObjectId of a User document
        ref: "User"  // This tells Mongoose that the ObjectId refers to a "User" document
    },    
});

module.exports=mongoose.model("Review",reviewSchema);