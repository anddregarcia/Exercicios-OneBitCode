import express from 'express';
import { createBrand, getBrand } from '../controller/BrandController.js';

const router = express.Router();

router.post('/', createBrand);
router.get('/', getBrand);
  
export default router;