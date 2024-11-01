const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const {
    createProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product');

//USER
//read
router.get('/products', getProducts);
router.get('/product/:id', getSingleProduct);

//ADMIN
//create
router.post('/admin/product/create', upload.array('images', 10), createProduct);
//update
router.put('/admin/product/update/:id', updateProduct);
//delete
router.delete('/admin/product/delete/:id', deleteProduct);

module.exports = router;