"use strict";
import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    address: {
        country: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        houseNum: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    price: { type: Number, required: true, min: 5, max: 10000 },
    rooms: { type: Number, required: true, min: 1, max: 15 },
    bathrooms: { type: Number, required: true, min: 1, max: 15 },
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
