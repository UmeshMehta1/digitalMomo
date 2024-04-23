const express = require("express")
const { connectDatabase } = require("./database/database")
const app = express()



const authRoute= require('./routes/authRoute')
const productRoute= require('./routes/productRoute')
const adminUsersRoute= require('./routes/adminUsersRouter')


// TELL NODE TO USE DOTENV
require("dotenv").config()


app.use(express.json())
app.use(express.urlencoded({extended : true}))


//telling node.js to give accesss to uploads folder
app.use(express.static("./uploads"))
//DATABASE CONNECTION
connectDatabase()

 //test api to check if server is live or not
app.get("/",(req,res)=>{
    res.status(200).json({   
        message : "I am alive"
    })
})


app.use("",authRoute)
app.use("",productRoute)
app.use("",adminUsersRoute)

const PORT = process.env.PORT
//listen server 
app.listen(PORT,()=>{
    console.log(`Server has started at PORT ${PORT} ` )
})