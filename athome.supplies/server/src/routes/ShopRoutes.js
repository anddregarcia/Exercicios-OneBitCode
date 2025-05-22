import express from 'express';
import { createShop, getShop } from '../controller/ShopController.js';

const router = express.Router();

router.post('/', createShop);
router.get('/', getShop);
  
export default router;