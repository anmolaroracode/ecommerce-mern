const express = require('express');
const Products = require('../models/Products');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// @Route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountedPrice,  
            countInStock,
            category,
            brand,
            sizes,
            colours,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku
        } = req.body;

        const product = new Products({
            name,
            description,
            price,
            discountedPrice,  // ✅ fixed
            countInStock,
            category,
            brand,
            sizes,
            colours,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id // Reference to admin creating product
        });

        const createdProduct = await product.save();
        return res.status(201).json(createdProduct); // ✅ added return

    } catch (error) {
        console.error("Product creation error:", error);

        if (error.code === 11000) {
            return res.status(400).json({ message: "SKU already exists" }); // ✅ better message
        }

        return res.status(500).json({ message: "Server Error" });
    }
});

//@route Put  api/prdouct/:id
//@desc updating an existing product using id
//@access Private/Admin
router.put('/:id',protect, admin, async(req, res)=>{
   try {
    console.log("Req body",req.body)
    const {
            name,
            description,
            price,
            discountedPrice,  
            countInStock,
            category,
            brand,
            sizes,
            colours,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku
        } = req.body;
        const product = await Products.findById(req.params.id)
        if(product){
            product.name = name || product.name
            product.description = description || product.description
            product.price = price || product.price
            product.discountedPrice = discountedPrice || product.discountedPrice
            product.countInStock = countInStock || product.countInStock
            product.category = category || product.category
            product.countInStock = countInStock || product.countInStock
            product.brand = brand || product.brand
            product.size = sizes || product.sizes
            product.colour = colours || product.colours
            product.collections = collections || product.collections
            product.material = material || product.material
            product.gender = gender || product.gender
            product.images = images || product.images
            product.isFeatured = isFeatured !== undefined ? isFeatured: product.isFeatured
            product.isPublished = isPublished !== undefined ? isPublished : product.isPublished
            product.tags = tags || product.tags
            product.dimensions = dimensions || product.dimensions
            product.weight = weight || product.weight
            product.sku = sku || product.sku
            const UpdatedProduct = await product.save();
            res.json(UpdatedProduct);
        }
        else{
            res.status(404).json({message:"Product not found"});
        }
   } catch (error) {
    console.error(error);
    res.status(500).json({message:"Server Error"});
    
   }

})

// @Route api/products/:id
// @desc Delete product by id
// @access Private/Admin
router.delete('/:id', protect, admin, async(req, res)=>{
    try {
        const product = await Products.findById(req.params.id);
        if(product){
            await product.deleteOne();
            res.json({message:"Product is removed"})
        }
        else{
            res.status(404).json({mesaage:"Product not Found"})
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"})
    }
});

// @route GET/api/products
// @desc Fetch all products according to filters 
// @access Public
router.get('/', async(req, res)=>{
    try {
        const{
            collections, 
            size, 
            colour, 
            gender, 
            minPrice, 
            maxPrice, 
            sortBy, 
            search, 
            category, 
            material, 
            brand, 
            limit
        } = req.query

        let query = {};

        if(collections && collections.toLowerCase() !== 'all'){
            query.collections = collections;
        }

        if(category && category.toLowerCase() !== 'all'){
            query.category = category;
        }

        if(material){
            query.material = {$in: material.split(',')}
        }

        if(brand){
            query.brand = {$in: brand.split(',')}
        }

        if(size){
            query.size = {$in: size.split(',')}
        }

        if(colour){
            query.colour = {$in: [colour]}
        }

        if(gender){
            query.gender = gender;
        }

        if(minPrice || maxPrice){
            query.price = {};
            if(minPrice) query.price.$gte = Number(minPrice);
            if(maxPrice) query.price.$lte = Number(maxPrice);
        }

        if(search){
            query.$or = [
                {name: {$regex: search, $options: 'i'}},
                {description: {$regex: search, $options: 'i'}}
            ]
        }
        let sort = {};
        if(sortBy){
            switch(sortBy){
                case 'priceAsc':
                    sort = {price: 1};
                    break;
                case 'priceDesc':
                    sort = {price: -1};
                    break;
                case 'Popularity':
                    sort = {rating: -1};
                    break;
                default:
                    break;            
            }
        }
        let products = await Products.find(query)
        .sort(sort)
        .limit(Number(limit) || 0)
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
})

//@route GET/api/products/best-sellers
//@desc Fetch all poducts with highest ratings
//@access Public
router.get('/best-sellers', async(req, res)=>{
    try {
        const bestSeller = await Products.find({}).sort({rating: -1});
        if(bestSeller){
            res.json(bestSeller);
        }
        else{
            res.status(404).json({message:"No Products Found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"});
        
    }
})

//@route GET/api/products/new-arrivals
//@desc Fetch all products sorted by created date
//@access Public
router.get('/new-arrivals', async(req, res)=>{
    try {
        const newArrivals = await Products.find({})
        .sort({createdAt: -1})
        .limit(10);
        if(newArrivals){
            res.json(newArrivals);
        }
        else{
            res.status(404).json({message:"No Products Found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
})

//@router GET/api/products/:id
//@desc Fetch single product by id
//@access Public
router.get('/:id', async(req, res)=>{
    try {
        const product = await Products.findById(req.params.id);
        if(product){
            res.json(product)
        }
        else{
            res.status(404).json({message:"Product Not Found"})
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"})
    }
})

//@route GET/api/products/similar/:id
//@desc Fetch similar products based on category, brand and gender
//@access Public 
router.get('/similar/:id', async(req, res)=>{
    const {id} = req.params;
    try {
        const product = await Products.findById(id);
        if(!product) res.status(404).json({message:"Product Not Found"});
        const similarProducts = await Products.find({
            _id: {$ne: id}, // Exclude the current Product
            gender : product.gender,
            category: product.category
        }).limit(4);
        res.json(similarProducts);

    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
})

module.exports = router;
