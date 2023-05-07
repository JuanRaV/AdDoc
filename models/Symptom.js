import { DataTypes } from "sequelize";
import db from "../config/db.cjs";

const Symptom = db.define("symptoms", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default Symptom;
