const express = require("express");
const router = express.Router();
const { addToCart, removeFromCart, getCart } = require("../controller/card.controller.js");
const auth = require("../middleware/auth.js");

router.get("/", auth, getCart);        
router.post("/add", auth, addToCart); 
router.delete("/remove", auth, removeFromCart);

module.exports = router;
