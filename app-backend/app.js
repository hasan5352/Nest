import express from "express";
import mongoose from "mongoose";
import listingRoutes from './routes/listings.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.urlencoded( {extended: true} ));
app.use(express.json());


// -------------------------------- Routes -----------------------------------------

app.use("/api/listings", listingRoutes);



// -------------------------------- Setup connection -----------------------------------------


async function main(url) {
	try{
		await mongoose.connect(url);
		console.log("Database connected")
	} catch (err){
		console.log(err)
	}
}

main(process.env.MONGO_URL)

app.listen(process.env.PORT, ()=>{
    console.log(`Server listening at port ${process.env.PORT}`);
});


