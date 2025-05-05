import express from 'express';
import { createState, getState } from '../controller/StateController.js';

const router = express.Router();

router.post('/', createState);
router.get('/', getState);
  
export default router;