import { check, validationResult  } from "express-validator"
import Doctor from "../models/Doctor.js"
import { generarId } from "../helpers/tokens.js"
import { emailRegistro } from "../helpers/emails.js"

const formLogin = (req,res)=>{
    res.render('auth/login',{
        pagina: "Login"
    })
}

const formSignup = (req,res)=>{
    res.render('auth/signup',{
        pagina: "SignUp"
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

    const{name,email,specialty,password} = req.body
    //Verificar que el resultado este vacion
    if(!resultado.isEmpty()){
        return res.render('auth/signup',{
            pagina: "SignUp",
            errors: resultado.array(),
            doctor:{
                name,
                email,
                specialty
            }
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
            }
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
        pagina: "Forget password?"
    }) 
}
export{
    formLogin,
    formSignup ,
    formForgotPassword,
    signUp,
    confirm
}