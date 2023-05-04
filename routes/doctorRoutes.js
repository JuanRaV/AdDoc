import express from 'express'
import { formLogin,formSignup,formForgotPassword } from '../controllers/doctorControllers.js';

const router = express.Router();

router.get('/login',formLogin)
router.get('/signup',formSignup)
router.get('/forget-password',formForgotPassword)

export default router 