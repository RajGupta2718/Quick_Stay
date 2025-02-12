const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js");
const { route } = require("./listing.js");

router
 .route("/signup")
 .get(userController.renderSignupForm)//GET /signup Route (Registration Form)
 .post(wrapAsync(userController.signup)) //POST /signup Route (Register New User)


router
 .route("/login")
 .get(userController.renderLoginForm)
 .post(saveRedirectUrl, passport.authenticate("local",{
    failureRedirect:"/login",  // Redirect back to login page if authentication fails
    failureFlash:true // Enable flash messages for failure
  }),
  userController.login
  )

 //  //GET /signup Route (Registration Form)
// router.get("/signup",userController.renderSignupForm);

// //POST /signup Route (Register New User)
// router.post("/signup",wrapAsync(userController.signup));

// // GET /login Route (Login Form)
// router.get("/login",userController.renderLoginForm);

// router.post("/login",saveRedirectUrl, passport.authenticate("local",{
//     failureRedirect:"/login",  // Redirect back to login page if authentication fails
//     failureFlash:true // Enable flash messages for failure
// }),
// userController.login
// )

router.get("/logout",userController.logout);
 
module.exports=router;