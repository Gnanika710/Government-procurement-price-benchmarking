import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name!"],
  },
  description: {
    type: String,
    required: [true, "Please enter your product description!"],
  },
  category: {
    type: String,
    required: [true, "Please enter your product category!"],
  },
  tags: {
    type: String,
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Please enter your product price!"],
  },
  stock: {
    type: Number,
  },
  image: {
    
      type: String,
      // required: true,
    },
  shopId: {
    type: Schema.Types.ObjectId, // Assuming shopId is an ObjectId
    ref: 'Shop',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("Product", productSchema);
