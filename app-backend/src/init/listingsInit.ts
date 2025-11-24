import mongoose from "mongoose";
import Listing, { ListingSchema } from "../models/listing";
import { fakerEN } from "@faker-js/faker";
import axios from "axios";
import {config} from "dotenv";

config();
const faker = fakerEN;

async function main(url: string): Promise<void> {
  await mongoose.connect(url);
  console.log('Database connected!');
}
// if (process.env.MONGO_URL) main(process.env.MONGO_URL)

function randomInt(min:number, max:number): number {
	return faker.number.int({ min, max });
}	

function randomTitle(country: string): string {
  const types: string[] = ['House', 'Villa', 'Apartment', 'Loft', 'Condo'];
  const features: string[] = ['Garden', 'Pool', 'Terrace', 'Garage', 'Fireplace'];
	const adjectives: string[] = ['Cozy', 'Spacious', 'Modern', 'Charming', 'Luxurious'];
  
  const type: string = types[Math.floor(Math.random() * types.length)] ?? 'Mansion';
  const feature: string = features[Math.floor(Math.random() * features.length)] ?? 'Gym';
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)] ?? 'Tranquil';
  
  return `${adjective} ${type} with ${feature} in ${country}`;
}

function randomAmenities(min: number, max: number): string[] {
	const amenities: string[] = [
	"High-speed internet","In-unit laundry","Dishwasher","Stainless steel appliances","Hardwood floors",
  "Walk-in closet","Balcony", "Patio","Private parking","Garage","Garden","Swimming pool","Gym", 'Backyard',
	"Security system","Smart home controls","Double-glazed windows","Fireplace","Solar panels","Modern kitchen",
	"Granite countertops","Furnished option", "Pet-friendly", "Elevator access", "Wheelchair accessible", 
	"Storage room", "Guest bedroom", "Ensuite bathroom", "Underfloor heating", "Air conditioning",
	"Central heating","Rooftop access" 
  ];
	if (min < 1 || max > amenities.length) throw Error(`Range of min & max = [1, ${amenities.length}]`);

	const numAmenities: number = randomInt(min, max);
	const picked: Set<string> = new Set();

	while (picked.size < numAmenities) {
    const aminity = amenities[randomInt(0, amenities.length-1)];
    if (aminity) picked.add(aminity)
  }
	return [...picked];
}

async function randomImgUrls(min: number, max: number, height:number, width:number): Promise<string[]> {
  if (min < 1 || max > 30) throw Error(`Range of min & max = [1, 30]`);

  interface UnsplashImg{ urls: { raw: string } };
  const count: number = randomInt(min, max);

  const res = await axios.get<UnsplashImg[]>("https://api.unsplash.com/photos/random",{ 
    params: {
      query: "house interior",
      count: count,
      client_id: process.env.UNSPLASH_ACCESS_KEY,
    }
  });
  console.log(res.data);
  return res.data.map((img: UnsplashImg) => `${img.urls.raw}&auto=format&fit=crop&w=${width}&h=${height}&q=60`);
}

async function randomListing(): Promise<ListingSchema> {
	const country: string = faker.location.country();
	return {
		address: {
			country: country,
			city: faker.location.city(),
			street: faker.location.street(),
      houseNum: faker.location.buildingNumber(),
      postalCode: faker.location.zipCode()
		},

		price: randomInt(5000, 10000),
    rooms: randomInt(1, 15),
    bathrooms: randomInt(1, 15),

		title: randomTitle(country),
		description: faker.lorem.sentences({ min: 5, max: 10 }),

		amenities: randomAmenities(5, 20),
		imgs: await randomImgUrls(3, 10, 600, 600)
	};
}

async function postListingsToDB(count: number): Promise<void> {
  if (count < 1 || count > 40) throw Error(`Range of count = [1, 40] due to unspash limit`);

  const listings: ListingSchema[] = [];
  for (let i = 0; i < count; i++) listings.push(await randomListing());

  try {
    await Listing.insertMany(listings);
    console.log("listings saved!");
  } catch (err){
    console.log("Could not save listings");
    console.log(err);
  }
}

postListingsToDB(40);