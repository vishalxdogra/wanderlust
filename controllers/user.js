const express_error=require('../utils/express_error.js');
const User=require('../models/user.js');
const flash=require('connect-flash');


module.exports.signupFrom=(req,res,next)=>{
    res.render('./users/signUp.ejs')
}

module.exports.signup=async(req,res)=>{
    try{
        let{username, email, password}=req.body;
        const newUser= new User({username,email});
        let reguser=await User.register(newUser,password);
        req.login(reguser,(err)=>{
           if(err){
            next(err);
           }
           req.flash("success","Welcome to Wanderlust");
           res.redirect('/listings');
        })
        //console.log(reguser);
        
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect('/signUp');
    }
}


module.exports.loginFrom=(req,res)=>{
    res.render('./users/login.ejs');
};

module.exports.login=async(req,res)=>{
    req.flash("success","Login Successfull");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        return next(err);
    });
    req.flash("success","User Logged Out");
    res.redirect('/listings');
};