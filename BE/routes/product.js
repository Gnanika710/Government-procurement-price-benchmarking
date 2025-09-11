import express from 'express';
import {createProduct} from '../controllers/product.js';
import { updatedProduct , getProduct} from '../controllers/product.js';
const router = express.Router();

router.post('/create-product', createProduct);
router.put('/update-product/:id', updatedProduct)
router.get('/get-product/:id', getProduct)



export default router;
