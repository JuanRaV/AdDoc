import express from 'express'
import { formLogin,formSignup } from '../controllers/doctorControllers.js';

const router = express.Router();

router.get('/login',formLogin)
router.get('/signup',formSignup)


export default router 