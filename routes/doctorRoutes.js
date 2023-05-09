import express from 'express'
import { admin,registerPatient,softDeletePatient,editPatient,redirectDashboard,getEditPatientPage } from '../controllers/doctorController.js';
import authenticate from '../middlewares/auth.js';

const router = express.Router();

router.get('/',authenticate,admin)
router.get('/edit-patient/:id',authenticate,getEditPatientPage)
router.post('/edit-patient/:id',authenticate,editPatient)
router.post('/register-patient',authenticate,registerPatient,redirectDashboard)
router.delete('/patient/:id',softDeletePatient)

export default router;