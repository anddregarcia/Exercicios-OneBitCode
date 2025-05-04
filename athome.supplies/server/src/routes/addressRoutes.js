import express from 'express';
import { createAddress, getAddress } from '../controller/AddressController.js';

const router = express.Router();

router.post('/', createAddress);
router.get('/', getAddress);
  
export default router;