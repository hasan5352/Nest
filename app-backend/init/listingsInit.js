"use strict";
import mongoose from "mongoose";
import Listing from "../models/listing.js";
import { fakerEN } from "@faker-js/faker";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const faker = fakerEN;
async function main(url) {
  await mongoose.connect(url);
	console.log('Database connected!');
}
main(process.env.MONGO_URL)

// ----------------------------------------- Generate Random Functions ----------------------------------

function randomInt(min, max) {
	return faker.number.int({ min, max });
}	

function randomTitle(country) {
  const types = ['House', 'Villa', 'Apartment', 'Loft', 'Condo'];
  const features = ['Garden', 'Pool', 'Terrace', 'Garage', 'Fireplace'];
	const adjectives = ['Cozy', 'Spacious', 'Modern', 'Charming', 'Luxurious'];
  
  const type = types[Math.floor(Math.random() * types.length)];
  const feature = features[Math.floor(Math.random() * features.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  
  return `${adjective} ${type} with ${feature} in ${country}`;
}

function randomAmenities(min, max){
	const amenities = [
	"High-speed internet","In-unit laundry","Dishwasher","Stainless steel appliances","Hardwood floors",
  "Walk-in closet","Balcony", "Patio","Private parking","Garage","Garden","Swimming pool","Gym", 'Backyard',
	"Security system","Smart home controls","Double-glazed windows","Fireplace","Solar panels","Modern kitchen",
	"Granite countertops","Furnished option", "Pet-friendly", "Elevator access", "Wheelchair accessible", 
	"Storage room", "Guest bedroom", "Ensuite bathroom", "Underfloor heating", "Air conditioning",
	"Central heating","Rooftop access" ];
	if (min < 1 || max > amenities.length) throw Error(`Range of min & max = [1, ${amenities.length}]`);

	const numAmenities = randomInt(min, max);
	const picked = new Set();

	while (picked.size < numAmenities) picked.add(amenities[randomInt(0, amenities.length-1)])
	return [...picked];
}

async function randomImgUrls(min, max){
	if (min < 1 || max > 30) throw Error(`Range of min & max = [1, 30]`);

	const count = randomInt(min, max);

	const res = await axios.get("https://api.unsplash.com/photos/random",{ 
		params: {
      query: "house interior",
      count: count,
      client_id: process.env.UNSPLASH_ACCESS_KEY,
    }
	});
	return res.data.map(img => `${img.urls.raw}&auto=format&fit=crop&w=800&q=60`);
}

async function randomListing() {
	const country = faker.location.country();
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
		imgs: await randomImgUrls(3, 10)
	};
}

async function postListingsToDB(count){
	if (count < 1 || count > 40) throw Error(`Range of count = [1, 40]`);

	const listings = [];
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