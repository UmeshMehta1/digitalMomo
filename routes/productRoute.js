const { createProduct, getProduct, getProducts, deleteProduct, editProduct } = require("../controller/admin/product/productController");
const isAuthenticated = require("../middleware/isAuthenticated");
const permitTo = require("../middleware/permitTo");
const catchAsync = require("../services/catchAsync")

const router= require("express").Router()
const {multer, storage}=require("../middleware/multerConfig")
const upload=multer({storage:storage})


router.route('/products')
.post(isAuthenticated,permitTo("admin"),upload.single('productImage'), catchAsync(createProduct))
.get(catchAsync(getProducts))

router.route('/products/:id').get(catchAsync(getProduct))
.delete(isAuthenticated,permitTo("admin"),catchAsync(deleteProduct))
.patch(isAuthenticated,permitTo("admin"),upload.single('productImage'),catchAsync(editProduct))

module.exports = router;
