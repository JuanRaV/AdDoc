import express from 'express'
import doctorRoutes from './routes/doctorRoutes.js'

const app = express()

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