const jwt = require("jsonwebtoken");
const {promisify}=require("util");
const User = require("../model/userModel");

const isAuthenticated =async(req,res,next)=>{
   const token= req.headers.authorization
   if(!token){
      return res.status(403).json({
         message: "please login"
      })
      }
      // vrify if the token is legit or not

      //  jwt.verify(token,process.env.SECRET_KEY,(err,success)=>{
      //    if(err){
      //       res.status(400).json({
      //          message: "Invalid Token"
      //       })
      //    }else{
      //       res.status(200).json({
      //          success: "Valid token"
      //       })
      //    }
      //  })


       //Alternative
    
   try {
      const decoded = await promisify(jwt.verify)(token,process.env.SECRET_KEY)
      const doesUserExist= await User.findOne({_id: decoded.id})

      if(!doesUserExist){
         return res.sendStatus(401).json({
            message: "user doesn't exists with that token/id"
         })
      }

      req.user= doesUserExist
   
   next()
   } catch (error) {
      res.status(404).json({
         message:error.message
      })
   }
}

module.exports= isAuthenticated