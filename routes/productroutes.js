const express = require("express");
const {
  getProducts,
  getProduct,
  getUserProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/product.controller.js");

const auth = require("../middleware/auth.js");

const router = express.Router();

// 🟢 Public routes
router.get("/", getProducts);          // get all products (no login required)

// 🟢 Protected routes
router.get("/my-products", auth, getUserProducts); // get products of logged-in user
router.get("/:id", auth, getProduct);              // get single product
router.post("/", auth, createProduct);             // create product
router.put("/:id", auth, updateProduct);           // update product (only owner)
router.delete("/:id", auth, deleteProduct);        // delete product (only owner)

module.exports = router;
