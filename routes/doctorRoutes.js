import express from 'express'
import { admin,registerPatient,softDeletePatient,editPatient,redirectDashboard,getEditPatientPage } from '../controllers/doctorController.js';
import passport from '../config/passportConfig.js';
import isAuth from '../middlewares/auth.js';

const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: true }),admin);
router.get('/edit-patient/:id',isAuth,getEditPatientPage)
router.post('/edit-patient/:id',isAuth,editPatient)
router.post('/register-patient',isAuth,registerPatient,redirectDashboard)
router.delete('/patient/:id',softDeletePatient)

export default router;