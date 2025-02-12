const User=require("../models/user.js");
//GET /signup Route (Registration Form)
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

//POST /signup Route (Register New User)
module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username}); // Create a new user instance with email and username
        const registerUser=await User.register(newUser,password);
        // console.log(registerUser);//For debugging: logs the registered user
        
        //  logs in the user immediately after they register(signUp)
        req.login(registerUser,(err)=>{
            if(err){
                return next(err); // If there is an error during login, pass it to the next error-handling middleware.
            }
            req.flash("success","welcome to QuickStay !"); //Flash success message
            res.redirect("/listings");// Redirect to listings page after successful registration
        })
        
    }catch(e){
        req.flash("error",e.message); // Flash error message if registration fails
        res.redirect("/signup") // Redirect back to the signup page on error
    } 
};

// GET /login Route (Login Form)
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
};

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to QuickStay! "); // Flash success message
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl); // Redirect to listings page after successful login
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out !");
        res.redirect("/listings");
    })
}