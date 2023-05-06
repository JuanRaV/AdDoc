import express from 'express'
import { admin,registerPatient } from '../controllers/dashboardController.js';
import authenticate from '../middlewares/auth.js';

const router = express.Router();

router.get('/',authenticate,admin)

router.post('/register',authenticate,registerPatient)

export default router;