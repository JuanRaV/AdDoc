import express from 'express'
import { admin } from '../controllers/dashboardController.js';
import authenticate from '../middlewares/auth.js';

const router = express.Router();

router.get('/',authenticate,admin)

export default router;