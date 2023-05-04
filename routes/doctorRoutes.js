import express from 'express'
import { formLogin,formSignup,formForgotPassword,confirm,signUp } from '../controllers/doctorControllers.js';

const router = express.Router();

router.get('/login',formLogin)

router.get('/signup',formSignup)
router.post('/signup',signUp)

router.get('/confirm/:token',confirm)

router.get('/forget-password',formForgotPassword)

export default router 