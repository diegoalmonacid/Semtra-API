import express from 'express';
import { getAllAdmins } from '../controllers/adminController.js';

const router = express.Router();

router.get('/', getAllAdmins);

export default router;