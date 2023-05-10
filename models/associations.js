import db from "../config/db.js";
import { DataTypes } from "sequelize";
import Patient from "./Patient.js";
import Symptom from "./Symptom.js";
import Doctor from "./Doctor.js";

Doctor.hasMany(Patient, {
  foreignKey: "doctorId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Patient.belongsTo(Doctor, { foreignKey: "doctorId" });

const PatientSymptom = db.define("patient_symptoms", {
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Patient,
      key: "id",
    },
  },
  symptomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Symptom,
      key: "id",
    },
  },
});

Patient.belongsToMany(Symptom, { through: PatientSymptom });
Symptom.belongsToMany(Patient, { through: PatientSymptom });

export { Doctor,Symptom,Patient, PatientSymptom}
