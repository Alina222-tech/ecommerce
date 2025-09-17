const Cart = require("../model/card.model.js");

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
      return res.status(200).json({ message: "Quantity updated", cartItem });
    }

    cartItem = new Cart({ userId, productId, quantity });
    await cartItem.save();

    res.status(201).json({ message: "Item added to cart", cartItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const cartItem = await Cart.findOneAndDelete({ userId, productId });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    res.status(200).json({ message: "Item removed from cart", cartItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all cart items for user
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.find({ userId }).populate(
      "productId",
      "name price image"
    ); // populate productId with name, price, image
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  addToCart,
  removeFromCart,
  getCart,
};
