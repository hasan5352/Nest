import express from "express";
import mongoose from "mongoose";
import listingRoutes from './routes/listing';
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.urlencoded( {extended: true} ));
app.use(express.json());


// -------------------------------- Routes -----------------------------------------

app.use("/api/listings", listingRoutes);



// -------------------------------- Setup connection -----------------------------------------


async function main(url: string) {
	try{
		await mongoose.connect(url);
		console.log("Database connected")
	} catch (err){
		console.log("Database unable to connect")
		console.log(err)
	}
}
if (process.env.MONGO_URL) main(process.env.MONGO_URL)

app.listen(process.env.PORT, ()=>{
    console.log(`Server listening at port ${process.env.PORT}`);
});


