const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const engine = require('ejs-mate');
const Listing = require("./models/listing");

app.engine('ejs', engine);
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

// ------------------------------------------ GET ROUTES ------------------------------------------

app.get("/listings", async (req, res)=>{        // INDEX ROUTE
    try {
        let listings = await Listing.find({}, 'title price img country address.city rooms bathrooms');
        res.render("listings/index.ejs", { listings });
    } catch(err){
        console.log(err);
        res.status(500).send("Internal Database error. Try again in sometime");
    }
});

app.get("/listings/new", async (req, res)=>{        // create listing
    res.render("listings/new.ejs");
});

app.get("/listings/:id", async (req, res)=>{        // view listing
    try{
        let listing = await Listing.findById(req.params.id);
        res.render("listings/show.ejs", { listing });
    } catch (err){
        console.log(err);
        res.status(500).send("Internal database error. Try again in sometime.");
    }
});

// ------------------------------------------ POST ROUTES -----------------------------------------------
app.post("/listings", async (req, res)=>{        // create listing
    try{
        req.body.address = { 
            city: req.body.city, house_num: req.body.house_num, 
            street: req.body.street, postal_code: req.body.postal_code
        }
        await Listing.insertOne(req.body);
        res.status(200).send("Listing saved in DB");
    } catch (err){
        // send the fields which are missing and thus causing validation error
        if (err.name == "ValidationError" || err.code == 121) res.status(400).send(Object.keys(err.errors));
        else res.status(500).send("Internal DB error. Please try again in sometime.");
    }
});


// ------------------------------------------ PATCH ROUTES -----------------------------------------------
app.patch("/listings/:id", async (req, res)=>{        // update listing
    try {
        let updateObj = {};
        for (let key of Object.keys(req.body)){
            updateObj[key] = req.body[key];
        }
        await Listing.updateOne({_id: req.params.id}, updateObj, {runValidators: true});
        res.send("Sucessfully updated listing.");
    } catch (err){
        console.log(err);
        res.status(500).send("Internal database error. Try again in sometime.");
    }
});

// ------------------------------------------ DESTROY ROUTES -----------------------------------------------
app.delete("/listings/:id", async (req, res)=>{
    try {
        await Listing.deleteOne({ _id: req.params.id });
        res.send("Sucessfully deleted listing.");
    } catch (err){
        console.log(err);
        res.status(500).send("Internal database error. Try again in sometime.");
    }
});


// ------------------------------------------ FRONT-END DATA SENDING ROUTES ------------------------------------------
const COUNTRY_DATA_PATH = "./data/countryData.json";
app.get("/api/countryData", async (req,res)=>{                // countries data
    fs.readFile(COUNTRY_DATA_PATH, 'utf8',(err, data) => {
        if (err) res.status(500).send("Internal Server Error");
        res.send(data);
    });
});

// ------------------------------------------ Error Handling ------------------------------------------