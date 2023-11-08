const Product = require("../../../model/productModel")

exports.createProduct= async(req,res)=>{
   const file=req.file
   let filePath
   if(!file){
    filePath="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxkrTO1qB5t_2ZpncRbvpyGOndQXyZ_x1BiNqnnquocQ&s"
   }else{
    filePath=req.file.filename
   }
   
    const{productName, productDescription, productPrice,productStatus, productStockQty}=req.body
    console.log(productName, productDescription, productPrice,productStatus, productStockQty)
    if(!productName|| !productDescription|| !productPrice||!productStatus||!productStockQty){

        return res.status(400).json({
            message:"please provide productName, productDescription, productPrice,productStatus, productStockQty"
        })
    }

    //insert into the product collection/table
    await Product.create({
        productName, 
        productDescription, 
        productPrice,
        productStatus, 
        productStockQty,
        productImage:filePath
    })
    res.status(200).json({
        message:"product created successfully"
    })
}