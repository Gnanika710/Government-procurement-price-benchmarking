import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import Product from '../models/product.js';
import Shop from '../models/shop.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const uploadFile = (file, folder) => {
  const uploadPath = path.join(__dirname, "../uploads", folder, file.name);
  return new Promise((resolve, reject) => {
    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(file.name);
      }
    });
  });
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, category, tags, originalPrice, discountPrice, stock, shopId } = req.body;

    // Check if a file was uploaded
    const imageFile = req.files?.image;
    let imageFileName = '';

    if (imageFile) {
      try {
        imageFileName = await uploadFile(imageFile, 'products'); // Upload file and get the file name
      } catch (error) {
        return res.status(500).json({ message: 'Failed to upload image', error: error.message });
      }
    }

    // Validate Shop ID
    const existingShop = await Shop.findById(shopId);
    if (!existingShop) {
      return res.status(400).json({ message: 'Shop ID is invalid!' });
    }

    // Create product
    const productData = {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      image: imageFileName, // Store the image file name or path
      shopId,
    };
    console.log(productData);

    const newProduct = await Product.create(productData);

    res.status(201).json({
      success: true,
      product: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatedProduct =  async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, description, category, tags, originalPrice, discountPrice, shopId } = req.body;

    // Handle file upload
    let imagePath = '';
    if (req.files && req.files.image) {
      const image = req.files.image;
      const uploadPath = path.join(__dirname, '../uploads', image.name);
      await image.mv(uploadPath);
      imagePath = uploadPath;
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      name,
      price,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      shopId,
      image: imagePath || undefined // Only update if a new image is uploaded
    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// get all the products
export const getProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the product.", error: error.message });
  }
};
