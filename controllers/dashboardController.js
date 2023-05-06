import { check, validationResult  } from "express-validator"
import Patient from "../models/Patient.js"

const admin = (req,res)=>{
    res.render('dashboard/admin',{
        pagina: "Dashboard",
        barra:true,
        csrfToken:req.csrfToken()
    })
}
const registerPatient=async(req,res)=>{
    await check('name').notEmpty().withMessage("Name is required").run(req)
    await check('email').isEmail().withMessage("Email that's not an email").run(req)
    await check('age').notEmpty().isNumeric().withMessage("Age is required").run(req)
    await check('address').notEmpty().withMessage("Address is required").run(req)
    await check('phoneNumber').notEmpty().isNumeric().withMessage("Phone is required").run(req)

    let resultado = validationResult(req);
    const {email} = req.body
    if(!resultado.isEmpty()){
        return res.render('dashboard/admin',{
            pagina: "Dashboard",
            errors: resultado.array(),
            csrfToken:req.csrfToken(),
            patient:{
                ...req.body
            }
        })
    }
    
    const existPatient = await Patient.findOne({where:{email}})
    if(existPatient){
        return res.render('dashboard/admin',{
            pagina:"Dashboard",
            errors:[{msg:'Patient already registered'}],
            patient:{
                ...req.body
            },
            csrfToken:req.csrfToken()
        })
    }

    await Patient.create({
        ...req.body,
        doctorId: req.userId
    })
    return res.render('dashboard/admin',{
        pagina:"Dashboard",
        barra:true,
        success:{
            msg:"Patient created"
        }
    })
    
}
export{
    admin,
    registerPatient
}