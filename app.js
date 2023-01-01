if(process.env.NODE_ENV!=="production"){
 require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path')
const catchAsyncError = require('./utility/catchAsyncError')
const ExpressError = require('./utility/ExpressError')
const {campgroundSchema,reviewSchema} = require('./joiSchema')// to validate incoming rquest body coming from post request

const mongoose = require('mongoose');
const session= require('express-session');
const flash= require('connect-flash')
const methodOverride = require('method-override');


const ejsMAte = require('ejs-mate')
const Campground = require('./models/campground');//campgrounds model
const Review = require('./models/review')//reviews model
const campgroundsRoutes = require('./routes/campgrounds')//campgrounds express route
const reviewsRoutes = require('./routes/reviews')//review express route
const User= require('./models/user') //get user model
const usersRoutes= require('./routes/users')//get the users route
const passport= require('passport')//for authentication purpose
const LocalStrategy = require('passport-local');
const { initialize } = require('passport');

mongoose.connect('mongodb://localhost:27017/yelpcamp');//connect our mongoose database

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
};




app.use(express.urlencoded({ extended: true}))//to parse post request body into readle form


app.engine('ejs',ejsMAte)
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))
app.use(methodOverride('_method'));


app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
app.use(flash());


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => { 
  res.locals.currentUser = req.user;//to see current user that is logged in
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})


app.use('/',usersRoutes)//go to users route

app.use('/campgrounds', campgroundsRoutes)//go to campgrounds route


app.use('/campgrounds/:id/reviews', reviewsRoutes)//go to review route





app.get('/',(req,res)=>{
  res.render('home')
 })
app.all('*',(req,res,next)=>{
  //throw a error using express error class
   next(new ExpressError('page not found ',404)) 
 })

 //use as a default error middleware function 
app.use((err,req,res,next)=>
{
   const  {statusCode = 500} = err;
   if(!err.message) err.message = "Oh! No There is Some Error";
   res.status(statusCode).render('error',{err})
})
 
app.listen(3000,()=>{
  console.log("welcome Home ")
})  