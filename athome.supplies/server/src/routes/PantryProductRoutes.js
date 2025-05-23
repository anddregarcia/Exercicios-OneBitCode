import express from 'express';
import { createPantryProduct, getPantryProduct } from '../controller/PantryProductController.js';

const router = express.Router();

router.post('/', createPantryProduct);
router.get('/', getPantryProduct);
  
export default router;