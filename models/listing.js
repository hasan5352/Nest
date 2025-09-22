"use strict";

const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    price: Number,
    location: String,
    img: {
        type:String, 
        set(v){
            let link = 'https://media.istockphoto.com/id/2228579645/photo/error-404-an-error-message-within-a-glass-frame-indicating-that-a-file-cannot-be-found-on-the.webp?a=1&b=1&s=612x612&w=0&k=20&c=NQQz7_eVhL_zkUi0juXyJDqXutfBF9Z8zYDnhkTyNlM=';
            return (v === '')? link : v;
        }
    },
    title: {type:String, required:true},
    description: String,
    country: String
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;