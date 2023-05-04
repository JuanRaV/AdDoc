import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt'
import db from '../config/db.js'

const Doctor = db.define('doctors',{
    name: {
        type: DataTypes.STRING,
        allowNull:false
    },
    email: {
        type: DataTypes.STRING,
        allowNull:false
    },
    name: {
        type: DataTypes.STRING,
        allowNull:false
    },
    specialty:{
        type: DataTypes.STRING,
        allowNull:false
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false
    },
    token: DataTypes.STRING,
    verified: DataTypes.BOOLEAN
},{
    hooks:{
        beforeCreate: async function(doctor){
            const salt = await bcrypt.genSalt(10)
            doctor.password= await bcrypt.hash(doctor.password,salt)
        },
    }
}
)

export default Doctor;