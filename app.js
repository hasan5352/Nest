const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const Listing = require("./models/listing");

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
        let listings = await Listing.find({}, 'title price img country address.city');
        res.render("home.ejs", { listings });
    } catch(err){
        console.log(err);
        res.status(500).send("Internal Database error. Try again in sometime");
    }
});

app.get("/listings/new", async (req, res)=>{
    res.render("add-listing.ejs");
});
const COUNTRY_DATA_PATH = "./data/countryData.json"
app.get("/api/countryData", (req,res)=>{
    const raw = fs.readFileSync(COUNTRY_DATA_PATH);
    const countryData = JSON.parse(raw);
    res.send(countryData);
});

// ------------------------------------------ POST -----------------------------------------------
app.post("/listings", async (req, res)=>{
    try{
        req.body.address = { city: req.body.city, house_num: req.body.house_num, street: req.body.street }
        await Listing.insertOne(req.body);
        res.status(200).send("Listing saved in DB");
    } catch (err){
        if (err.name == "ValidationError" || err.code == 121) res.status(400).send(Object.keys(err.errors));
        else res.status(500).send("Internal DB error. Please try again in sometime.");
    }
});

