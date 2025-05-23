import express from 'express';
import { createPantry, getPantry } from '../controller/PantryController.js';

const router = express.Router();

router.post('/', createPantry);
router.get('/', getPantry);
  
export default router;