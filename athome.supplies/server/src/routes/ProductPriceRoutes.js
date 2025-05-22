import express from 'express';
import { createProductPrice, getProductPrice } from '../controller/ProductPriceController.js';

const router = express.Router();

router.post('/', createProductPrice);
router.get('/', getProductPrice);
  
export default router;