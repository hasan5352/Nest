import mongoose from "mongoose";
let fallbackImg: string = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOt34TqkJaeLxGwu76Yqrdn6EzoyIb2Kdohw&s";


export interface ListingSchema {
  address: { country: string, city: string, street: string, houseNum: string, postalCode: string },
  price: number,
  rooms: number,
  bathrooms: number,
  title: string,
  description?: string,
  amenities?: string[],
  imgs?: string[],
}

const listingSchema = new mongoose.Schema<ListingSchema>({
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
  title: {type:String, required:true},
  description: String
}, 
{ strict: true }
);

const Listing = mongoose.model<ListingSchema>("Listing", listingSchema);
export default Listing;
