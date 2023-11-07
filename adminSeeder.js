const User = require("./model/userModel")
const bcrypt = require("bcryptjs")

const adminSeeder = async()=>{
    
 // admin seeding

 // check where admin exists or not
 const isAdminExists = await User.findOne({userEmail:"umeshadmin@gmail.com"})

 if(!isAdminExists){
    await User.insertMany({
        userEmail:"admin@gmail.com",
        userPassword: bcrypt.hashSync("admin",10),
        userPhoneNumber: "1223333333",
        userName: "admin",
        role:"admin"
     })    
     console.log("Admin seeding successfully..")
 }else{
    console.log("Admin already seeded...")


 }

}

module.exports=adminSeeder