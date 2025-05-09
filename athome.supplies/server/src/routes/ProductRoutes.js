import express from 'express';
import { createProduct, getProduct } from '../controller/ProductController.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/', getProduct);
  
export default router;