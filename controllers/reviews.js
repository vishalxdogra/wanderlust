const review=require("../models/reviews.js");
const Listing=require("../models/listing.js");


module.exports.postReview=async(req,res,next)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new review(req.body.review);
    newReview.author=req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review added");
    res.redirect(`/listings/${listing._id}`);
}


module.exports.deleteReview=async(req,res,next)=>{
    let {id,Reviewid}=req.params;
    console.log(id);
    let result=await Listing.findByIdAndUpdate(id,{$pull:{reviews: Reviewid}});
    // console.log(result)
    await review.findByIdAndDelete(Reviewid);
    req.flash("success","Review deleted successfully");
    res.redirect(`/listings/${id}`);
}