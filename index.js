import express from 'express'
import doctorRoutes from './routes/doctorRoutes.js'
import db from './config/db.js'

const app = express()

//Conexion a la base de datos
try {
    await db.authenticate()
    console.log('Conectado a la DB')
} catch (error) {
    console.log(error)
}
//Habilitando pug
app.set('view engine', 'pug')
app.set('views','./views')

//Routing
app.use('/',doctorRoutes)

app.use(express.static('public'))

const port = 3000
app.listen(port,()=>{
    console.log(`Servidor corriendo en el puerto ${port}`)
}) 