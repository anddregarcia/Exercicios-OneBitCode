import express from 'express';
import { createItem, getItem } from '../controller/ItemController.js';

const router = express.Router();

router.post('/', createItem);
router.get('/', getItem);
  
export default router;