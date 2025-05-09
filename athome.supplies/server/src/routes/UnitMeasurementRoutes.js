import express from 'express';
import { createUnitMeasurement, getUnitMeasurement } from '../controller/UnitMeasurementController.js';

const router = express.Router();

router.post('/', createUnitMeasurement);
router.get('/', getUnitMeasurement);
  
export default router;