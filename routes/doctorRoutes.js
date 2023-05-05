import express from 'express'
import { formLogin,formSignup,formForgotPassword,confirm,signUp,resetPassword,checkToken,newPassword } from '../controllers/doctorControllers.js';

const router = express.Router();

router.get('/login',formLogin)

router.get('/signup',formSignup)
router.post('/signup',signUp)

router.get('/confirm/:token',confirm)

router.get('/forget-password',formForgotPassword)
router.post('/forget-password',resetPassword)

//Almacena el nuevo password
router.get('/forget-password/:token',checkToken)
router.post('/forget-password/:token',newPassword)

export default router 