import jwt from "jsonwebtoken";
import {Doctor} from '../models/associations.js'

const authenticate = async(req, res, next) => {
    const {_token} = req.cookies;
  
    if (!_token) {
      return res.redirect('/login');
    }
  
    try {
      const decoded = jwt.verify(_token, process.env.JWT_SECRET);
      const doctor = await Doctor.scope('eliminarPassword').findByPk(decoded.id)
      
      if(doctor){
        req.doctor = doctor
      }else{
        return res.redirect('/login')
      }
      return next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };

export default authenticate;