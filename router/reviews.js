const express=require('express');
const { route } = require('./listings');
const router=express.Router({mergeParams:true});
const {reviewValidate, isAuthor, isLoggedIn}=require('../middleware.js');
const reviewController=require('../controllers/reviews.js');
const wrapAsync=require('../utils/wrapAsync.js');



//Review route
router.post('/',isLoggedIn,reviewValidate,wrapAsync(reviewController.postReview));

//DELETE REVIEWS
router.delete('/:Reviewid',isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));


module.exports=router;