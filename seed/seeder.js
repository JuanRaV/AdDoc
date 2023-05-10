import doctor from "./doctor.js";
import patient from "./patient.js";
import symptoms from "./symptoms.js";
import db from "../config/db.js";
import{Doctor,Symptom,Patient} from '../models/associations.js'

const importData = async()=>{
    try {
        await db.authenticate()

        await db.sync()

        await Promise.all([
            Doctor.bulkCreate(doctor),
            Patient.bulkCreate(patient),
            Symptom.bulkCreate(symptoms)
        ])

        console.log('Datos importados correctamente')
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

const deleteData = async()=>{
    try {
        await db.sync({force:true})
        console.log('Datos eliminados correctamente')
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

if(process.argv[2]==='-i'){
    importData()
}
if(process.argv[2]==='-d'){
    deleteData()
}