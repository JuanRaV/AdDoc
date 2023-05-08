import { check, validationResult  } from "express-validator"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import Doctor from "../models/Doctor.js"
import { generarJWT, generarId } from "../helpers/tokens.js"
import { emailRegistro,emailOlvidePassword } from "../helpers/emails.js"

const formLogin = (req,res)=>{
    res.render('auth/login',{
        pagina: "Login",
        csrfToken:req.csrfToken()
    })
}
const auth = async (req,res)=>{
    //Validacion
    await check('email').isEmail().withMessage("Email is required").run(req)
    await check('password').notEmpty().withMessage("Password is required").run(req)
    let resultado = validationResult(req)
    //Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/login',{
            pagina: "LogIn",
            errors: resultado.array(),
            csrfToken:req.csrfToken()
        })
    }

    //Comprobar si el usuario existe
    const{email,password} = req.body

    const doctor = await Doctor.findOne({where:{email}})
    if(!doctor){
        return res.render('auth/login',{
            pagina: "LogIn",
            errors: [{msg:"The user doesn't exist"}],
            csrfToken:req.csrfToken()
        })
    }

    //Comprobar si el usuario esta confirmado
    if(!doctor.verified){
        return res.render('auth/login',{
            pagina: "LogIn",
            errors: [{msg:"Your account hasn't been confirmed"}],
            csrfToken:req.csrfToken()
        })
    }

    //Revisar el password
    if(!doctor.verifyPassword(password)){
        return res.render('auth/login',{
            pagina: "LogIn",
            errors: [{msg:"Incorrect Password"}],
            csrfToken:req.csrfToken()
        })
    }

    //Autenticar al usuario
    const token = generarJWT({id: doctor.id, name: doctor.name})

    //Guardando el token en un cookie
    return res.cookie('_token',token,{
        httpOnly:true,
        // secure:true
    }).redirect('/dashboard')
}
const formSignup = (req,res)=>{
    res.render('auth/signup',{
        pagina: "SignUp",
        csrfToken:req.csrfToken()
    })
} 

const signUp=async(req,res)=>{
    //Validation
    await check('name').notEmpty().withMessage('Name is required').run(req)
    await check('email').isEmail().withMessage("That's not an email").run(req)
    await check('specialty').notEmpty().withMessage("Specialty is required").run(req)
    await check('password').isLength({min:6}).withMessage("Password must be at least of 6 characters").run(req)
    await check('repeatPassword').equals('password').withMessage("Password are not the same").run(req)

    let resultado = validationResult(req)

    const{name,email,specialty} = req.body
    //Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/signup',{
            pagina: "SignUp",
            errors: resultado.array(),
            doctor:{
                name,
                email,
                specialty
            },

            csrfToken:req.csrfToken()
        })
    }

    //Vetificar que el usuario no este registrado
    const existsDoctor = await Doctor.findOne({where:{email}})
    if(existsDoctor){
        return res.render('auth/signup',{
            pagina: "SignUp",
            errors:[{msg:'Account already registered'}],
            doctor:{
                name,
                email,
                specialty
            },
            csrfToken:req.csrfToken()
        })
    }

    //Save doctor in DB
    const doctor = await Doctor.create({
        ...req.body,
        token:generarId()
    })

    //Sending email confirmation
    emailRegistro({
        name:doctor.name,
        email:doctor.email,
        token:doctor.token
    })
    //Mostrar msj de confirmacion
    res.render('templates/message',{
        pagina:'Confirmation Page',
        message:"We've sent you a confirmation email"
    })

}

//Function to confirm account
const confirm=async(req,res,next)=>{
    const{token}=req.params
    //Verificar si es valido
    const doctor = await Doctor.findOne({where:{token}})

    if(!doctor){
        return res.render('auth/confirm-account',{
            pagina:'Error confirming your account',
            message:"There was an error confirming your account, try again",
            error:true
        })
    }
    //Confirmar cuenta
    doctor.verified = true
    doctor.token = null
    await doctor.save()

    return res.render('auth/confirm-account',{
        pagina:'Account confirmated successfully',
        message:"The account was confirmated successfully ",
    })
}

const formForgotPassword = (req,res)=>{
    res.render('auth/forgot-password',{
        pagina: "Forget password?",
        csrfToken:req.csrfToken()
    }) 
}

const resetPassword=async(req,res)=>{
    //Validation
    await check('email').isEmail().withMessage("That's not an email").run(req)

    let resultado = validationResult(req)

    //Verificar que el resultado este vacion
    if(!resultado.isEmpty()){
        return res.render('auth/forgot-password',{
            pagina: "Forget password?",
            csrfToken:req.csrfToken(),
            errors: resultado.array()
        })
    }

    //Buscar el usuario
    const {email} = req.body
    const doctor = await Doctor.findOne({where:{email}})
    if(!doctor){
        return res.render('auth/forgot-password',{
            pagina: "Forget password?",
            csrfToken:req.csrfToken(),
            errors: [{msg:"Email not registered"}]
        }) 
    }

    //Generar token
    doctor.token= generarId()
    await doctor.save()

    //Enviar email
    emailOlvidePassword({
        email:doctor.email,
        name:doctor.name,
        token:doctor.token
    })
    //Renderizar un msj
    return res.render('templates/message',{
        pagina:'Reset your password',
        message:"We've sent you an email with the instructions",
    })
}

const checkToken=async(req,res,)=>{
    const {token} = req.params
    const doctor = await Doctor.findOne({where:{token}})

    if(!doctor){
        return res.render('auth/confirm-account',{
            pagina:'Error changing your password',
            message:"There was an error changing your password, try again",
            error:true
        })
    }

    //Mostrar un form para modificar el password
    res.render('auth/reset-password',{
        pagina:"Reset your password",
        csrfToken: req.csrfToken()

    })
}   

const newPassword=async(req,res)=>{
    //Validar password
    await check('password').isLength({min:6}).withMessage("Password must be at least of 6 characters").run(req)

    let resultado = validationResult(req)
    //Verificar que el resultado este vacion
    if(!resultado.isEmpty()){
        return res.render('auth/reset-password',{
            pagina: "Reset your password",
            errors: resultado.array(),
            csrfToken:req.csrfToken()
        })
    }
    //Identificar quien hace el cambio
    const {token} = req.params
    const{password} = req.body
    const doctor = await Doctor.findOne({where:{token}})

    //Hashear password
    const salt = await bcrypt.genSalt(10)
    doctor.password= await bcrypt.hash(password,salt)
    doctor.token = null

    await doctor.save()

    res.render('auth/confirm-account',{
        pagina:"Password reseted",
        message:"Password saved correctly"
    })
    
}
export{
    formLogin,
    formSignup ,
    formForgotPassword,
    signUp,
    confirm,
    resetPassword,
    checkToken,
    newPassword,
    auth
}