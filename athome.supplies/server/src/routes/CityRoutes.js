import express from 'express';
import { createCity, getCity } from '../controller/CityController.js';

const router = express.Router();

router.post('/', createCity);
router.get('/', getCity);
  
export default router;