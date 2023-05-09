import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash'
import passport from 'passport';
import session from 'express-session'
import doctorRoutes from './routes/doctorRoutes.js';
import authRoutes from './routes/authRoutes.js';
import db from './config/db.cjs';
import "./models/associations.js";

await db.sync();

const app = express();

// Enable reading data from forms
app.use(express.urlencoded({extended:true}));

// Enable cookie parser
app.use(cookieParser());

app.use(    
    session({
      secret: process.env.SESSION_SECRET, // this should be a secret string stored in your .env file
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

// Enable csrf
app.use(csrf({cookie:true}));

app.use(passport.initialize());

app.use(passport.session());

app.use(flash())
//Enable flash (for notifications)
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
  });

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
app.use('/',authRoutes);
app.use('/dashboard',doctorRoutes);
app.use(express.static('public'));

const port = process.env.PORT||3000;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});
