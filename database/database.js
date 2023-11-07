const mongoose = require("mongoose")
const User = require("../model/userModel")
const adminSeeder = require("../adminSeeder")


exports.connectDatabase = async()=>{
    // connecting to database 
// jaba samma database sanga connect hudainw wait gar
 await mongoose.connect(process.env.MONGO_URI)
 console.log("Database connected successfully")

 // admin seeding
 adminSeeder()
 
}