const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
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

app.get("/", (req, res)=>{
  res.send("standard GET");
});


