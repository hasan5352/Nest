import express from "express";
import mongoose from "mongoose";
import listingRoutes from './routes/listings.js';

const app = express();
app.use(express.urlencoded( {extended: true} ));
app.use(express.json());


// -------------------------------- Routes -----------------------------------------

app.use("/api/listings", listingRoutes);



// -------------------------------- Setup connection -----------------------------------------

const MONGO_URL = 'mongodb://127.0.0.1:27017/nest';
const PORT = 8080;
async function main(url) {
    try{
        await mongoose.connect(url);
        console.log("Database connected")
    } catch (err){
        console.log(err)
    }
}

main(MONGO_URL)

app.listen(PORT, ()=>{
    console.log(`Server listening at port ${PORT}`);
});


