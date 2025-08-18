const Listing=require("./models/listing");
const review=require("./models/reviews.js");
const {listingschema}=require('./schema.js');
const express_error=require('./utils/express_error.js');

const {reviewSchema}=require('./schema.js');



module.exports.isLoggedIn= (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash('error',"You Must be Logged In");
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async(req,res,next)=>{
    const {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","Permission denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//validating listing schema using joi
module.exports.validatelisting=(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
    //console.log(result);
    if(error){
        let errorMsg=error.details.map((el)=>el.message).join(',');
        throw new express_error(400,errorMsg);
    }
    else{
        next();
    }

}

module.exports.reviewValidate=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    //console.log(result);
    if(error){
        let errorMsg=error.details.map((el)=>el.message).join(',');
        throw new express_error(400,errorMsg);
    }
    else{
        next();
    }
}


module.exports.isAuthor = async (req, res, next) => {
    const { id, Reviewid } = req.params; 
    const newreview = await review.findById(Reviewid);

    // if (!newreview) {
    //     req.flash("error", "permission denied");
    //     return res.redirect(`/listings/${id}`);
    // }

    if (!newreview.author.equals(res.locals.currUser._id)) {
        req.flash("error", "Permission denied");
        return res.redirect(`/listings/${id}`);
    }

    next();
};