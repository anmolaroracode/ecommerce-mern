const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Products');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

const getCart = async (guestId, userId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

// @route   POST /api/cart
// @desc    Add items to cart as a guest or logged-in user
// @access  Public
router.post('/', async (req, res) => {
  const { productId, quantity, size, colour, guestId, userId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product Not Found" });

    // Determine if user is logged in or guest
    const cart = await getCart(guestId, userId);

    if (cart) {
      // Check if the product already exists in cart
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.colour === colour
      );

      if (productIndex > -1) {
        // Update quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // Add new product
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          colour,
          quantity
        });
      }

      // Recalculate total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      // Create new cart
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + Date.now(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            colour,
            quantity
          }
        ],
        totalPrice: quantity * product.price
      });

      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

//@route PUT /api/cart
//@update product quantity in the cart
//@access public
router.put('/', async (req, res) => {
    const { productId, quantity, size, colour, guestId, userId } = req.body;

    try {
        const cart = await getCart(guestId, userId);
        if (!cart) return res.status(404).json({ message: "Cart Not Found" });
        const product = await Product.findById(productId);
        if(!product) return res.status(404).json({ message: "Product Not Found"});
        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.colour === colour
        );

        if (productIndex > -1) {
            if (quantity > 0) {
                // Update quantity
                cart.products[productIndex].quantity = quantity;
            } else {
                // Remove product if quantity is 0
                cart.products.splice(productIndex, 1);
            }
        }

        // Recalculate total price
        cart.totalPrice = cart.products.reduce(
            (acc, product) => acc + product.price * product.quantity,
            0
        );

        await cart.save();
        return res.status(200).json(cart);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

//@route DELETE /api/cart
//@desc remove product form the cart
//@access public
router.delete('/', async (req, res) => {
  const {productId, size, colour, guestId, userId} = req.body;
  try {
    const cart = await getCart(guestId, userId);
    if(!cart) return res.status(404).json({message:"Cart Not Found"});
    const productIndex = cart.products.findIndex(
      (p)=> p.productId.toString() === productId &&
      p.size === size &&
      p.colour === colour
    );
    if(productIndex > -1){
      cart.products.splice(productIndex, 1);
      // Recalculate total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      )
      await cart.save();
      
      return res.status(200).json({message: "Product Removed Successfully", cart});
    }
    return res.status(404).json({message: "Product Not Found In Cart"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Server Error"});
  }
});

// @route GET /api/cart
// @disc display cart items
// @access public

router.get('/', async(req, res)=>{
  const {guestId, userId} = req.query;
  try {
    const cart = await getCart(guestId, userId);
    if(!cart) return res.status(404).json({message: "Cart Not Found"});
    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Server Error"});    
  }
})

//@route api/cart/merge
//@desc merge guest cart with user cart after login
//@access private
router.post('/merge', protect, async (req, res) => {
  const { guestId } = req.body;
  const userId = req.user._id;

  try {
    const guestCart = await Cart.findOne({ guestId });
    if (!guestCart) return res.status(404).json({ message: "Guest Cart Not Found" });

    let userCart = await Cart.findOne({ user: userId });

    // If user has no cart, convert guest cart → user cart
    if (!userCart) {
      guestCart.user = userId;
      guestCart.guestId = undefined;
      await guestCart.save();
      return res.status(200).json(guestCart);
    }

    // Merge products
    guestCart.products.forEach((guestProduct) => {
      const productIndex = userCart.products.findIndex(
        (p) =>
          p.productId.toString() === guestProduct.productId.toString() &&
          p.size === guestProduct.size &&
          p.colour === guestProduct.colour
      );

      if (productIndex > -1) {
        // Increase quantity
        userCart.products[productIndex].quantity += guestProduct.quantity;
      } else {
        // Add new product
        userCart.products.push(guestProduct);
      }
    });

    // Recalculate total price
    userCart.totalPrice = userCart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Save updated cart
    await userCart.save();

    // Delete guest cart
    await Cart.findByIdAndDelete(guestCart._id);

    return res.status(200).json(userCart);

  } catch (error) {
    console.error("💥 MERGE ERROR:", error);
    return res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
});


module.exports = router;
