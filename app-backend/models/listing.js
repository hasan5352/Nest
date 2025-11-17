"use strict";
import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    price: { type: Number, required: true },
    country: { type: String, required: true },
    address: {
        city: { type: String, required: true },
        street: { type: String, required: true },
        houseNum: { type: Number, required: true },
        postalCode: { type: String, required: true },
    },
    rooms: Number,
    bathrooms: Number,
    amenities: [String],
    imgs: [String],
    img: {
        type:String, 
        set(v){
            let fallback = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOt34TqkJaeLxGwu76Yqrdn6EzoyIb2Kdohw&s";
            return (v === '')? fallback : v;
        }
    },
    title: {type:String, required:true},
    description: String
}, { strict: true });

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
