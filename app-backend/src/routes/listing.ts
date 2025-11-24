import express from 'express';
import Listing from "../models/listing";

function capitalizeWord(word: string): string {
  return (word)? word[0]!.toUpperCase() + word.slice(1).toLowerCase() : '';
}

const router = express.Router();

router.get("/", async (req, res)=>{
  try {
    let listings = await Listing.find({}, {
      title:1, price:1, 'address.country':1, 'address.city':1, imgs: {$slice: 1}
    });

    let q: string = (typeof req.query.q == 'string')? req.query.q : '';

    if (q) {
      q = q.toLowerCase();
      listings = listings.filter((l) => {
        if (l.title.toLowerCase().includes(q)) return true;
        if (l.address.country.toLowerCase().includes(q)) return true;
        if (l.address.city.toLowerCase().includes(q)) return true;
        return false;
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
    const listing = await Listing.findById(req.params.id);
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
    
    req.body.address.city = req.body.city.split(' ').map(capitalizeWord).join(' ');
    req.body.address.country = req.body.country.split(' ').map(capitalizeWord).join(' ');

    req.body.title = req.body.title.trim();

    if (req.body.description) req.body.description = req.body.description.trim();
    
    if (req.body.amenities) req.body.amenities = req.body.amenities
      .map((s: string) => capitalizeWord(s.trim())).filter((s: string) => s != '');

    if (req.body.imgs) req.body.imgs = req.body.imgs
      .map((s: string) => s.trim()).filter((s: string) => s != '')

    await Listing.insertOne(req.body);
    res.status(200).send("Listing saved!");
  } catch (err: any){
    // send the fields which are missing and thus causing validation error
    if (err?.name == "ValidationError" || err?.code == 121) 
      res.status(400).send(`Missing mandatory fields in request body:\n- ${Object.keys(err.errors).join('\n-')}`);

    else res.status(500).send(err?.msg || err);
  }
});



export default router;