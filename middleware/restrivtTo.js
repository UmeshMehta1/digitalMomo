const restrictTo=(...roles)=>{
    return (req,res,next)=>{
        const userRole=req.user.role
        console.log(userRole)
        console.log(roles)
        if(!roles.includes(userRole)){
            res.status(403).send({
                message:"your doesn't have permiddion for this forbidden"
            })
        }else{
            next()
        }

    }
    
}

module.exports= restrictTo