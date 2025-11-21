import express from "express";
import Listing from "../models/listing.js";

const capitalizeWord = (word) => word[0].toUpperCase() + word.slice(1).toLowerCase();

const router = express.Router();

router.get("/", async (req, res)=>{
  try {
    let listings = await Listing.find({}, {
      title:1, price:1, 'address.country':1, 'address.city':1, imgs: {$slice: 1}
    });

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
    req.body.address = {};
    ['city', 'street', 'houseNum', 'postalCode', 'country'].forEach(k => { req.body.address[k] = req.body[k].trim() });
    
    req.body.address.city = req.body.city.split(' ').map(w => capitalizeWord(w)).join(' ');
    req.body.address.country = req.body.country.split(' ').map(w => capitalizeWord(w)).join(' ');

    req.body.description = req.body.description.trim();
    req.body.title = req.body.title.trim();

    if (req.body.amenities) 
      req.body.amenities = req.body.amenities.map(s => capitalizeWord(s.trim())).filter(s => s != '');
    if (req.body.imgs) 
      req.body.imgs = req.body.imgs.map(s => s.trim()).filter(s => s != '')

    await Listing.insertOne(req.body);
    res.status(200).send("Listing saved!");
  } catch (err){
    // send the fields which are missing and thus causing validation error
    if (err.name == "ValidationError" || err.code == 121) 
      res.status(400).send(`Missing mandatory fields in request body:\n- ${Object.keys(err.errors).join('\n-')}`);

    else res.send(err);
  }
});


export default router;