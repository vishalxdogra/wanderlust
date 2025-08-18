if(process.env.NODE_ENV !="production"){
require('dotenv').config();
}
const express=require('express');

const app=express();
const mongoose=require('mongoose');
const Listing=require("./models/listing.js");
const path=require("path");
const data = require('./init/data.js');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');//use for adding a single page like nav bar to every page of our website that will be the same
const express_error=require('./utils/express_error.js');
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');

const listings=require('./router/listings.js');
const reviews=require('./router/reviews.js');
const user=require('./router/user.js');


//db connect
const db_url=process.env.ATLAS_DB;
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(db_url);
}
//session store
const store= MongoStore.create({
    mongoUrl:db_url,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
});
store.on("error",()=>{
    console.log("eroor in MONGO SESSION STORE",err);
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.use(session(sessionOptions));

app.use(flash());



app.use(passport.initialize());
app.use(passport.session()); //Used for the session to identify the user and ease in login 

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

// app.get('/demouser',async(req,res)=>{
//     let fakeuser= new User({
//         email:"abc@gmail.com",
//         username:"abc",
//     })
//     let registeredUser=await User.register(fakeuser,"helloworld");
//     res.send(registeredUser);
// })

app.use('/listings',listings);
app.use('/listings/:id/review',reviews);
app.use('/',user);




//ROUTE FOR ALL UNDESCRIBED PATHS
app.all("*",(req,res,next)=>{
    next(new express_error(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("./listings/error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("http://localhost:8080/listings");
})