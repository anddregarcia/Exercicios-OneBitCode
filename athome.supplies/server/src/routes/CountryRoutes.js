import express from 'express';
import { createCountry, getCountry } from '../controller/CountryController.js';

const router = express.Router();

router.post('/', createCountry);
router.get('/', getCountry);
  
export default router;