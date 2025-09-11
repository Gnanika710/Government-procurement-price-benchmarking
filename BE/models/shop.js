import { Schema, model } from "mongoose";
import pkg from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { hash, compare } = pkg;

const shopSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter your shop name!"],
  },
  zipCode:{
    type:String,
  },
  address: {
    type: String,
    required: true,
  },
  website: {
    type: String,  
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  selectedService: {
    type: String, 
  },
  socialMedia: {
    facebook: { type: String },  
    instagram: { type: String },
    twitter: { type: String },
  },
  phoneNumber: {
    type: Number, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Hash password before saving
shopSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await hash(this.password, 10);
});

// JWT Token Generation
shopSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Password Comparison
shopSchema.methods.comparePassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

export default model("Shop", shopSchema);
