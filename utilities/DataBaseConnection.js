
const mongoose=require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MongoDB_Url)

const db=mongoose.connection

db.on("error", console.error.bind(console, "MongoDB connection error:"));

db.once("open", () => {
  console.log("MongoDB connection successful!");
});

module.exports = mongoose;


