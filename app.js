const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing");
const { error, count } = require("console");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded( {extended: true} ));
app.use(express.json());

const MONGO_URL = 'mongodb://127.0.0.1:27017/nest';
async function main(url) {
  await mongoose.connect(url);
}
main(MONGO_URL)
    .then(()=>{console.log("Database connected")})
    .catch(err => console.log(err));

const PORT = 8080;
app.listen(PORT, ()=>{
    console.log(`Server listening at port ${PORT}`);
});

app.get("/listings", async (req, res)=>{
    try {
        let listings = await Listing.find({}, 'title price img');
        res.render("home.ejs", { listings });
    } catch(err){
        console.log(err);
        res.status(500).send("Internal Database error. Try again in sometime");
    }
});

app.get("/listings/new", async (req, res)=>{
    let countryNames = [];
    try{ 
        // get countries whose currency is EUR to display in form drop-down menu
        let countries = await fetch("https://restcountries.com/v3.1/currency/EUR");
        countries = await countries.json();
        countryNames = countries.map((country)=>{
            return country.name.common;
        }).sort();
        res.render("add-listing.ejs", { countryNames });
    }catch (err){
        console.log(err);
        res.render("add-listing.ejs", { countryNames });
    }
});

// ------------------------------------------ POST -----------------------------------------------
app.post("/listings", async (req, res)=>{
    try{
        await Listing.insertOne(req.body);
        res.status(200).send("Listing saved in DB");
    } catch (err){
        console.log(err);
        if (err.name == "ValidationError" || err.code == 121) res.status(400).send("Title is required.");
        else res.status(500).send("Internal DB error. Please try again in sometime.");
    }
});

app.post("/testListing", async (req, res)=>{
    try{
        await Listing.insertOne(req.body);
        console.log(await Listing.find({}));
        res.send("got the listing!");
    } catch (err){
        console.log(err);
        res.status(500).send("Internal DB error. Try sending info again");
    }
})