const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const { saveRedirectUrl } = require('../middleware.js');
const userController=require('../controllers/user.js');




router.route('/signUp')
.get(userController.signupFrom)
.post(wrapAsync(userController.signup));



router.route('/login').get(userController.loginFrom)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}),userController.login);


router.get('/logout',userController.logout);

module.exports=router;