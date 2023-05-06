import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import doctorRoutes from './routes/doctorRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import db from './config/db.js';
import "./models/associations.js";
await db.sync();

const app = express();

// Enable reading data from forms
app.use(express.urlencoded({extended:true}));

// Enable cookie parser
app.use(cookieParser());

// Enable csrf
app.use(csrf({cookie:true}));

// Connect to the database
try {
    await db.authenticate();
    
    console.log('Connected to the DB');
} catch (error) {
    console.log(error);
}

// Enable Pug
app.set('view engine', 'pug');
app.set('views','./views');

// Routing
app.use('/',doctorRoutes);
app.use('/dashboard',dashboardRoutes);
app.use(express.static('public'));

const port = process.env.PORT||3000;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});
