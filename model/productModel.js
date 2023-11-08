const mongoose= require("mongoose")
const Schema = mongoose.Schema;


const productSchema= new Schema({
    productName:{
        type: String,
        require:[true,"productName must be Provided"]
    },
    productDescription:{
        type:String,
        require:[true,"productDescription must be provided"]
    },
    productStockQty:{
        type:Number,
        required:[true,"Product Quantity must be provided"],
    },
    productPrice:{
        type:Number,
        require:[true,"productPrice must be provided"]
    },
    productStatus:{
        type:String,
        enum:["available","unavailable"]
    },
    productImage:String
},{
    timestamps: true  //this will create createdAt and updatedAt field automatically
});


const Product = mongoose.model("Product", productSchema)
module.exports=Product