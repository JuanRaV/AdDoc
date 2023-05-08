import { check, validationResult  } from "express-validator"
import Patient from "../models/Patient.js"
import Symptom from "../models/Symptom.js";

const admin =async  (req,res)=>{
    const symptoms = await Symptom.findAll();
    const patients = await Patient.findAll({ where: { deleted: false } });
    
    res.render('dashboard/admin',{
        pagina: "Dashboard",
        barra:true,
        csrfToken:req.csrfToken(),
        symptoms,
        patients,        
    })
}
const registerPatient=async(req,res,next)=>{
    await check('name').notEmpty().withMessage("Name is required").run(req)
    await check('email').isEmail().withMessage("Email that's not an email").run(req)
    await check('age').notEmpty().isNumeric().withMessage("Age is required").run(req)
    await check('address').notEmpty().withMessage("Address is required").run(req)
    await check('phoneNumber').notEmpty().isNumeric().withMessage("Phone is required").run(req)

    const patients = await Patient.findAll({ where: { deleted: false } });
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
    
    const existPatient = await Patient.findOne({where:{email,deleted: false}})
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
        patients,
    })
    
}
const redirectDashboard=(req,res)=>{

    res.redirect('/dashboard')

}
const softDeletePatient = async(req,res) =>{
    const patientId = req.params.id;
    console.log("deleted patient")
  // Soft delete the patient by setting the deleted field to true
    await Patient.update(
        { deleted: true },
        { where: { id: patientId, deleted: false } }
    );

  // Redirect to the desired page after soft deletion
     res.redirect('/dashboard');

}
const getEditPatientPage=async(req,res)=>{
    const patientId = req.params.id;
    const symptoms = await Symptom.findAll();
    console.log(patientId)

    const patient = await Patient.findOne({where:{id:patientId}})
    res.render('dashboard/edit-patient',{
        patient,
        barra:true,
        pagina:"Edit Patient",
        csrfToken:req.csrfToken(),
        symptoms,
    })
}
const editPatient=async(req,res)=>{
    const {id}  = req.params
    const {age,phoneNumber,...restBody} = req.body
    try {
        await Patient.update(
            { age,
            phoneNumber,
            restBody },
            { where: { id } }
        );
        
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
    }

    
    
}
export{
    admin,
    registerPatient,
    softDeletePatient,
    editPatient,
    redirectDashboard,
    getEditPatientPage
}