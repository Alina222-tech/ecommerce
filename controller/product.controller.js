const Product = require("../model/product.model");
const cloudinary = require("../config/cloudinary");
const { v4: uuidv4 } = require("uuid");

// 🟢 Get All Products (Public)
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("user", "name email");
    res.status(200).json(products);
  } catch (err) {
    console.error("Backend getProducts error:", err); // <-- log full error
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

// 🟢 Get Single Product (Auth required)
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("user", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
};

// 🟢 Get Products for Logged-in User
const getUserProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user products", error: err.message });
  }
};

// 🟢 Create Product (Auth required)
const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const imageFile = req.files?.image;
    const imageUrl = req.body.image;

    if (!name || !description || !price || (!imageFile && !imageUrl)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let uploadResponse;
    const uniqueFolder = `products/${uuidv4()}`;

    if (imageFile) {
      uploadResponse = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: uniqueFolder,
        public_id: "main_image",
      });
    } else {
      uploadResponse = { secure_url: imageUrl, public_id: null };
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: uploadResponse.secure_url,
      imagePublicId: uploadResponse.public_id,
      user: req.user.id, // ✅ store which user created it
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err.message });
  }
};

// 🟢 Update Product (Only Owner can update)
const updateProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const imageFile = req.files?.image;
    const imageUrl = req.body.image;

    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ ensure only owner can update
    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    // Handle image update
    if (imageFile || imageUrl) {
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }

      let uploadResponse;
      const uniqueFolder = `products/${uuidv4()}`;

      if (imageFile) {
        uploadResponse = await cloudinary.uploader.upload(imageFile.tempFilePath, {
          folder: uniqueFolder,
          public_id: "main_image",
        });
      } else {
        uploadResponse = { secure_url: imageUrl, public_id: null };
      }

      product.image = uploadResponse.secure_url;
      product.imagePublicId = uploadResponse.public_id;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;

    await product.save();
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
};

// 🟢 Delete Product (Only Owner can delete)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ ensure only owner can delete
    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  getUserProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
