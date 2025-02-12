const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(()=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/QuickStay');
}

const initDB = async () => {
  await Listing.deleteMany({});  // Deletes all documents in the 'Listing' collection.
  initData.data=initData.data.map((obj)=>({...obj, owner:'679e570b17084c58442b1a48'}));
  await Listing.insertMany(initData.data); // Inserts data from 'initData.data'.
  console.log("data was initialized");
};

initDB(); // Calls the function to initialize the database.