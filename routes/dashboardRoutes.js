import express from 'express'
import { admin } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/',admin)

export default router;