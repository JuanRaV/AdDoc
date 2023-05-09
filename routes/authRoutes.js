import express from 'express'
import { formLogin,formSignup,formForgotPassword,confirm,signUp,resetPassword,checkToken,newPassword,auth,logOut } from '../controllers/authControllers.js';

const router = express.Router();
router.get('/logout', logOut);

router.get('/login',formLogin)
router.post('/login',auth)

router.get('/signup',formSignup)
router.post('/signup',signUp)

router.get('/confirm/:token',confirm)

router.get('/forget-password',formForgotPassword)
router.post('/forget-password',resetPassword)

//Almacena el nuevo password
router.get('/forget-password/:token',checkToken)
router.post('/forget-password/:token',newPassword)

export default router 