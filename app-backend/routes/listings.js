import express from "express";
import Listing from "../models/listing.js";

const router = express.Router();

router.get("/", async (req, res)=>{
  try {
    let listings = await Listing.find({}, 'title price img country address.city');
    let q = req.query.q;

    if (q) {
      q = q.toLowerCase();
      listings = listings.filter((l) => {
        if (l.title.toLocaleLowerCase().includes(q)) return true;
        if (l.country.toLocaleLowerCase().includes(q)) return true;
        if (l.address.city.toLocaleLowerCase().includes(q)) return true;
      });
    }

    res.json(listings);
  } catch(err){
    console.log(err);
    res.status(500).send("Internal Database error.");
  }
})


router.get("/:id", async (req, res)=>{        // view listing
    try{
        let listing = await Listing.findById(req.params.id);
        res.json(listing)
    } catch (err){
        console.log(err);
        res.status(500).send("Internal database error. Try again in sometime.");
    }
});


router.post("/", async (req, res)=>{        // create listing
  try{
    req.body.address = { 
      city: req.body.city, houseNum: req.body.houseNum,
      street: req.body.street, postalCode: req.body.postalCode
    }
    await Listing.insertOne(req.body);
    res.status(200).send("Listing saved!");
  } catch (err){
    // send the fields which are missing and thus causing validation error
    if (err.name == "ValidationError" || err.code == 121) 
      res.status(400).send(`Missing mandatory fields in request body:\n- ${Object.keys(err.errors).join('\n-')}`);

    else res.status(500).send("Internal database error");
  }
});


export default router;