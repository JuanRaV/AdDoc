import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import doctorRoutes from './routes/doctorRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import db from './config/db.js'

const app = express()
//Habilitar lectura de datos de formularios
app.use(express.urlencoded({extended:true}));

//Habilitar cookie pparser
app.use(cookieParser())

//Habilitar csrf
app.use(csrf({cookie:true}))

//Conexion a la base de datos
try {
    await db.authenticate();
    db.sync();
    console.log('Conectado a la DB')
} catch (error) {
    console.log(error)
}
//Habilitando pug
app.set('view engine', 'pug')
app.set('views','./views')

//Routing
app.use('/',doctorRoutes)
app.use('/dashboard',dashboardRoutes)
app.use(express.static('public'))

const port = process.env.PORT||3000
app.listen(port,()=>{
    console.log(`Servidor corriendo en el puerto ${port}`)
}) 