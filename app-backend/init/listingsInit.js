"use strict";
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const { sampleListings } = require("../data/data.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/nest';
async function main(url) {
  await mongoose.connect(url);
}
main(MONGO_URL)
    .then(()=>{console.log("Database connected")})
    .catch(err => console.log(err));


for (let sampleListing of sampleListings){
    sampleListing.img = sampleListing.image.url;
    sampleListing.address.house_num = sampleListing.address.number;
}
async function postListings(listingData){
    try {
        await Listing.insertMany(listingData);
        console.log("listings saved!");
    } catch (err){
        console.log("Could not save listings");
        console.log(err);
    }
}

postListings(sampleListings);