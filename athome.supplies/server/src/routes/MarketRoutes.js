import express from 'express';
import { createMarket, getMarket } from '../controller/MarketController.js';

const router = express.Router();

router.post('/', createMarket);
router.get('/', getMarket);
  
export default router;