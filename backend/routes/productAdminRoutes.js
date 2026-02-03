const express = require('express');
const router = express.Router();
const Product = require('../models/Products');
const { protect, admin } = require('../middlewares/authMiddleware');

//@route POST /api/admin/products
//@desc Get All Products(admin only)
//@access Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const products = await Product.find({});
        if(!products){
            return res.status(404).json({ message: "No Products Found" });
        }
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}
);

//@route PUT /api/admin/products/:id
//@desc Update Product by ID (admin only)
//@access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    // Apply updates
    Object.assign(product, req.body);

    const updatedProduct = await product.save();
    res.json(updatedProduct);

  } catch (error) {
    console.error(error);

    // DUPLICATE SKU HANDLING
    if (error.code === 11000 && error.keyPattern?.sku) {
      return res.status(400).json({
        message: "SKU already exists. Please use a unique SKU.",
      });
    }

    res.status(500).json({ message: "Failed to update product" });
  }
});



//@route POST /api/admin/products
//@desc Add New Product (admin only)
//@access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);

  } catch (error) {
    console.error(error);

    // 🔥 DUPLICATE SKU HANDLING
    if (error.code === 11000 && error.keyPattern?.sku) {
      return res.status(400).json({
        message: "SKU already exists. Please use a unique SKU.",
      });
    }

    res.status(500).json({ message: "Failed to create product" });
  }
});


//@route DELETE /api/admin/products/:id
//@desc Delete Product by ID (admin only)
//@access Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const productId = req.params.id;

        // Find product by ID and delete
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product Not Found" });
        }

        res.json(deletedProduct);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}
);


module.exports = router;


