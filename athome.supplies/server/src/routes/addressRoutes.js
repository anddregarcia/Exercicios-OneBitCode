import express from 'express';
import { createAddress } from '../controller/AddressController.js';

const router = express.Router();

router.post('/address', createAddress);

export default router;