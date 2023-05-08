import { check, validationResult  } from "express-validator"
import Patient from "../models/Patient.js"
import Symptom from "../models/Symptom.js";

const admin =async  (req,res)=>{
    const symptoms = await Symptom.findAll();
    const patients = await Patient.findAll();

    res.render('dashboard/admin',{
        pagina: "Dashboard",
        barra:true,
        csrfToken:req.csrfToken(),
        symptoms,
        patients
    })
}
const registerPatient=async(req,res)=>{
    await check('name').notEmpty().withMessage("Name is required").run(req)
    await check('email').isEmail().withMessage("Email that's not an email").run(req)
    await check('age').notEmpty().isNumeric().withMessage("Age is required").run(req)
    await check('address').notEmpty().withMessage("Address is required").run(req)
    await check('phoneNumber').notEmpty().isNumeric().withMessage("Phone is required").run(req)

    const patients = await Patient.findAll();
    let resultado = validationResult(req);
    const {email} = req.body;
    const symptoms = await Symptom.findAll();
    if(!resultado.isEmpty()){
        return res.render('dashboard/admin',{
            pagina: "Dashboard",
            barra:true,
            errors: resultado.array(),
            csrfToken:req.csrfToken(),
            patient:{
                ...req.body
            },symptoms,
            patients
        })
    }
    
    const existPatient = await Patient.findOne({where:{email}})
    if(existPatient){
        return res.render('dashboard/admin',{
            pagina:"Dashboard",
            errors:[{msg:'Patient already registered'}],
            barra:true,
            patient:{
                ...req.body
            },
            csrfToken:req.csrfToken(),
            symptoms,
            patients
        })
    }

    await Patient.create({
        ...req.body,
        doctorId: req.userId
    })
    res.render('dashboard/admin',{
        pagina:"Dashboard",
        barra:true,
        success:{
            msg:"Patient created"
        },
        barra:true,
        symptoms,
        csrfToken:req.csrfToken(),
        patients
    })
    // setTimeout(()=>{
    //     window.location.reload()
    // },5000)
    
}

const softDeletePatient = async (req,res,next) =>{
    const patientId = req.params.id;

    await Patient.update(
        {deleted:true},
        {where:{
            id:patientId,
            deleted:false
        }}
    )
}

export{
    admin,
    registerPatient
}