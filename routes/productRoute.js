const { createProduct } = require("../controller/admin/product/productController");
const isAuthenticated = require("../middleware/isAuthenticated");
const permitTo = require("../middleware/permitTo");


const router= require("express").Router()
const {multer, storage}=require("../middleware/multerConfig")
const upload=multer({storage:storage})



router.route('/product').post(isAuthenticated,permitTo("admin"),upload.single('productImage'), createProduct)

module.exports = router;
