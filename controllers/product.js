const Product = require('../models/Product')
const cloudinary = require('cloudinary')
const APIFeatures = require('../utils/apiFeatures')

//CREATE
exports.createProduct = async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Please upload product images.'
        });
    }

    let imagesLinks = [];

    for (let i = 0; i < req.files.length; i++) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.files[i].path, {
                folder: 'products',
				width: 300,
				height: 300,
                crop: "scale",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Error uploading images.'
            });
        }
    }

    req.body.images = imagesLinks;
	// req.body.user = req.user.id;
    const product = await Product.create(req.body);

    if (!product) {
        return res.status(400).json({
            success: false,
            message: 'Product not created.'
        });
    }

    return res.status(201).json({
        success: true,
        product
    });
};

//READ ALL PRODUCTS

exports.getProducts = async (req, res, next) => {
	try {
	  const resPerPage = req.query.limit || 4;
	  const currentPage = req.query.page || 1;
	  const productsCount = await Product.countDocuments();
  
	  const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter();
	  apiFeatures.pagination(resPerPage, currentPage);
  
	  const products = await apiFeatures.query;
	  const filteredProductsCount = products.length;
  
	  if (!products) return res.status(400).json({ message: 'Error loading products' });
  
	  return res.status(200).json({
		success: true,
		count: products.length,
		products,
		resPerPage,
		filteredProductsCount,
		productsCount
	  });
	} catch (error) {
	  return res.status(500).json({ message: error.message });
	}
  };

//READ SPECIFIC PRODUCT
exports.getSingleProduct = async (req, res, next) => {
	const product = await Product.findById(req.params.id);
	if (!product) {
		return res.status(404).json({
			success: false,
			message: 'Product not found'
		})
	}
	return res.status(200).json({
		success: true,
		product
	})
}

// UPDATE PRODUCT
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        let images = [];

        if (typeof req.body.images === 'string') {
            images.push(req.body.images);
        } else if (Array.isArray(req.body.images)) {
            images = req.body.images;
        }

        if (images.length > 0) {
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.v2.uploader.destroy(product.images[i].public_id);
            }

            let imagesLinks = [];
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: 'products',
                    width: 300,
					height: 300,
                    crop: "scale",
                });
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            }

            req.body.images = imagesLinks;
        } else {
            req.body.images = product.images;
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res, next) => {
	const product = await Product.findByIdAndDelete(req.params.id);
	if (!product) {
		return res.status(404).json({
			success: false,
			message: 'Product not found'
		})
	}

	return res.status(200).json({
		success: true,
		message: 'Product deleted'
	})
}