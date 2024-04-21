const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../../model/userModel")
const sendEmail = require("../../services/sendEmail")

exports.registerUser=async(req,res)=>{
    const {email,password,phoneNumber,username} = req.body
    console.log(email,password,phoneNumber,username);
    if(!email||!password||!phoneNumber||!username){
       return res.status(400).json({
            message : "Please provide email,password,phoneNumber"
        })
    }

    // check if that email user already exist or not
   const userFound =  await User.find({userEmail:email})
    if(userFound.length > 0 ){
        return res.status(400).json({
            message : "User with that email already registered"
        })
    }

    // else 
    await User.create({
        userName:username,
        userPhoneNumber:phoneNumber,
        userEmail:email,
        userPassword : bcrypt.hashSync(password,10)
    })

    res.status(201).json({
        message : "User registered successfully"
    })
}

exports.loginUser= async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({
            message : "Please provide email,password"
        })
    }

    // check if that email user exists or not
    const userFound = await User.find({userEmail : email})
    if(userFound.length == 0){
        return res.status(404).json({
            message : "User with that email is not Registered"
        })
    }

    // password check 
    const isMatched = bcrypt.compareSync(password,userFound[0].userPassword)
    if(isMatched){
        // generate token 
       const token = jwt.sign({id : userFound[0]._id},process.env.SECRET_KEY,{
        expiresIn : '30d'
       })


        res.status(200).json({
            message : "User logged in successfully",
            token
        })
    }else{
        res.status(404).json({
            message : "Invalid Password"
        })
    }
    
}

//forgot pssword
exports.forgotPassword=async(req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.status(400).json({
            message : "please enter your email address"
        })
    }

    
// check if that email is registered or not
const userExist= await User.find({userEmail:email})
if(userExist.length==0){
    return  res.status(404).json({
        message:"No account associated with this email"
    })
}

// send otp to that email
const otp= Math.floor(100+Math.random()*9000);
userExist[0].otp=otp
await userExist[0].save();
sendEmail({
    email:email,
    subject: "Your Otp for digitalMomo forgotPassword",
    message:`OTP is ${otp}`
})
res.status(200).json({
    message:"OTP has been sent to your email"
})
}

//Verify otp
exports.verifyOtp= async(req,res)=>{
    const {email,otp}= req.body
    if(!email || !otp){
        return res.status(400).json({
            message: "please Provide email, otp"
        })
    }

    // check if that otp is crooect or not of that email
    const userExists=await User.find({userEmail:email})
    if(userExists.length==0){
        return res.status(404).json({
            message: "No Account Associated With This Email"
        })
    }
    if(userExists[0].otp !==otp){
        res.status(404).json({
            message: "Incorrect OTP"
        })
    }
        else{
            // dispost the otp so cannot be sed next time the same otp
            userExists[0].otp=undefined
            userExists[0].isOtpVerified= true;
            await userExists[0].save()
            res.status(200).json({
                message: "OTP Verified Successfully"
            })
        }
}

exports.resetPassword= async(req,res)=>{
    const {email, newPassword, confirmPassword}= req.body;
    if (!email||!newPassword || !confirmPassword) {
        return res.status(400).json({
        message: "plesase provide email, newpasword, conformpassword"   
        })
    }
    if(newPassword !== confirmPassword){
        return  res.status(400).json({
            message: "New password and Confirm Password do not match"
        })
    }
    
 const userExists= await User.find({userEmail:email})
 if(userExists.length==0){
    return res.status(404).json({
        message:"No account associated with this email"

    })
   }
   
    if(userExists[0].isOtpVerified !==true){
    return res.status(403).json({
        message: "You cannot perform this action"
    })
    }


 userExists[0].userPassword= bcrypt.hashSync(newPassword,10)
 userExists[0].isOtpVerified= false;
 await userExists[0].save()
 res.status(200).json({
    message:"Password Reseted Succesfully"
 })
}