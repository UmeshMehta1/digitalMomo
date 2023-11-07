const Product = require("../../../model/productModel")

exports.createProduct= async(req,res)=>{
   
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
        productStockQty
    })
    res.status(200).json({
        message:"product created successfully"
    })
}