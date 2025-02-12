// Only load .env in non-production environments
if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
 
const express=require("express");
const app=express();
const mongoose = require('mongoose');
const methodOverride = require('method-override'); //functionality of method overriding available to your application.
const ejsMate = require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo'); //
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

 
const path=require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method')); //The second line activates it and tells Express to look for method overrides in the _method parameter.
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const dbUrl=process.env.ATLASDB_URL;
const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",(err)=>{
    console.log("ERROR in MONGO SESSION STORE",err)
})
//basic setup-Session Middleware:
const sessionOptions={
    store,//monogo store releted goes to session 
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};
// app.get("/",(req,res)=>{
//     res.send("I am root");
// })


//using session middleware
app.use(session(sessionOptions));
// connect-flash Middleware: allows you to set flash messages during the lifecycle of a request.
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Passing Flash Messages to Views:
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next(); 
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student" //passport.mongo automatically add to schema
//     });
//     let registerUser=await User.register(fakeUser,"helloworld");
//     res.send(registerUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

//custom error handler middleware(Global Error Handling Middleware:)
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

//connection create
// const mongo_URL='mongodb://127.0.0.1:27017/QuickStay';

main()
.then(()=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl); //connect atlas db
}
app.get("/",(req,res)=>{
    res.send("I am root");
})

//server start
app.listen(8080,()=>{
    console.log("server is listening to port 8080")
})