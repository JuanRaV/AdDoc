import express from 'express'
import { admin,registerPatient,softDeletePatient } from '../controllers/doctorController.js';
import authenticate from '../middlewares/auth.js';

const router = express.Router();

router.get('/',authenticate,admin)

router.post('/register-patient',authenticate,registerPatient)
router.delete('/patient/:id',softDeletePatient)

export default router;