const Product = require("../../../model/productModel")
const fs = require("fs")

exports.createProduct = async (req, res) => {

    const file = req.file


    let filePath
    if (!file) {
        filePath = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxkrTO1qB5t_2ZpncRbvpyGOndQXyZ_x1BiNqnnquocQ&s"
    } else {
        filePath = req.file.filename
    }

    const { productName, productDescription, productPrice, productStatus, productStockQty } = req.body
    console.log(productName, productDescription, productPrice, productStatus, productStockQty)
    if (!productName || !productDescription || !productPrice || !productStatus || !productStockQty) {

        return res.status(400).json({
            message: "please provide productName, productDescription, productPrice,productStatus, productStockQty"
        })
    }

    //insert into the product collection/table
    await Product.create({
        productName,
        productDescription,
        productPrice,
        productStatus,
        productStockQty,
        productImage: filePath  //api+filePath dida vayo. like https://localhost:3000/filepath
    })
    res.status(200).json({
        message: "product created successfully"
    })



}

///get products

exports.getProducts = async (req, res) => {
    const products = await Product.find()

    if (products == 0) {
        return res.status(400).json({
            message: "product is not found, Try agani..",
            Product: []
        })
    } else {
        return res.status(200).json({
            message: "Products Fetch Successfully....",
            products
        })
    }


}

//get single product by id

exports.getProduct = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({
            message: "Please provide ProductId"
        })
    }

    const product = await Product.find({ _id: id })
    if (product.length == 0) {
        res.status(400).json({
            message: "No product found with that id",
            product: []
        })
    } else {
        res.status(200).json({
            message: "Product fetched successfully",
            product

        })
    }
}

// delete product

exports.deleteProduct = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({
            message: "Please provide id"
        })
    }
    const oldData = await Product.findById(id)
    if (!oldData) {
        return res.status(404).json({
            message: "No data found with that id"
        })
    }

    const oldProductImage = oldData.productImage // http://localhost:3000/1698943267271-bunImage.png"
    const lengthToCut = process.env.BACKEND_URL.length
    const finalFilePathAfterCut = oldProductImage.slice(lengthToCut)
    // REMOVE FILE FROM UPLOADS FOLDER
    fs.unlink("./uploads/" + finalFilePathAfterCut, (err) => {
        if (err) {
            console.log("error deleting file", err)
        } else {
            console.log("file deleted successfully")
        }
    })
    await Product.findByIdAndDelete(id)
    res.status(200).json({
        message: "Product delete successfully"
    })

}

//edit product
exports.editProduct = async (req, res) => {
    const { id } = req.params
    const { productName, productDescription, productPrice, productStatus, productStockQty } = req.body
    if (!productName || !productDescription || !productPrice || !productStatus || !productStockQty || !id) {
        return res.status(400).json({
            message: "Please provide productName,productDescription,productPrice,productStatus,productStockQty,id"
        })
    }
    const oldData = await Product.findById(id)
    if (!oldData) {
        return res.status(404).json({
            message: "No data found with that id"
        })
    }

    const oldProductImage = oldData.productImage // http://localhost:3000/1698943267271-bunImage.png"
    const lengthToCut = process.env.BACKEND_URL.length
    const finalFilePathAfterCut = oldProductImage.slice(lengthToCut) // 1698943267271-bunImage.png
    if (req.file && req.file.filename) {
        // REMOVE FILE FROM UPLOADS FOLDER
        fs.unlink("./uploads/" + finalFilePathAfterCut, (err) => {
            if (err) {
                console.log("error deleting file", err)
            } else {
                console.log("file deleted successfully")
            }
        })
    }

    const datas = await Product.findByIdAndUpdate(id, {
        productName,
        productDescription,
        productPrice,
        productStatus,
        productStockQty,
        productImage: req.file && req.file.filename ? process.env.BACKEND_URL + req.file.filename : oldProductImage
    }, {
        new: true,

    })
    res.status(200).json({
        messagee: "Product updated successfully",
        data: datas
    })

}

exports.updateProductStatus = async (req, res) => {
    const { id } = req.params
    const { productStatus } = req.body

    if (!productStatus || !['available', 'unavailable'].includes(productStatus.toLowerCase())) {
        return res.status(400).json({
            message: "productStatus is invalid or should be provided"
        })
    }
    const product = await Product.findById(id)
    if (!product) {
        return res.status(404).json({
            message: "No product found with that id"
        })
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, {
        productStatus
    }, { new: true })

    res.status(200).json({
        message: "product status updated Successfully",
        data: updatedProduct
    })
}