import {errorHandler} from "../utils/error.js";
import  verify from "jsonwebtoken";
import shop from "../api/models/shop.js";



export const isSeller = async(req,res,next) => {
    const {seller_token} = req.cookies;
    if(!seller_token){
        return next(new errorHandler("Please login to continue", 401));
    }

    const decoded = verify(seller_token, process.env.JWT_SECRET_KEY);

    req.seller = await shop.findById(decoded.id);

    next();
};


    