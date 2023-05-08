import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt'
const importDb = async () => {
    const db = await import('../config/db.cjs');
    return db.default;
  };
  
const db = await importDb();
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
})

//Metodos personalizados
Doctor.prototype.verifyPassword = function(password){
    return bcrypt.compareSync(password,this.password)
}

export default Doctor;