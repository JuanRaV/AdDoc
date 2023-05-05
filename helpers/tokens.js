import jwt from "jsonwebtoken"

//Creando el JWT
const generarJWT = data => jwt.sign({ id:data.id, name: data.name},process.env.JWT_SECRET,{expiresIn:"1d"})
const generarId = ()=>Math.random().toString(32).substring(2)+Date.now().toString(32)

export{
    generarId,
    generarJWT
}