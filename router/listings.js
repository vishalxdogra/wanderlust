const express=require('express');
const router=express.Router();
const multer  = require('multer')
const {storage}=require('../cloudconfig.js');
const upload = multer({ storage });
const listingcontroller=require('../controllers/listings.js');
const {validatelisting}=require('../middleware.js');
const {isLoggedIn}=require('../middleware.js');
const{isOwner}=require('../middleware.js');
const wrapAsync=require('../utils/wrapAsync.js');


router.get("/", listingcontroller.search);
router.get('/new',isLoggedIn,listingcontroller.newlistingForm);
 
router
    .route('/')
    .get(wrapAsync(listingcontroller.index))
    .post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingcontroller.postnew));


router
    .route('/:id')
    .get(wrapAsync(listingcontroller.showRoute))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validatelisting,wrapAsync(listingcontroller.postupdate))
    .delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.deletelisting));

router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingcontroller.getUpdate));




module.exports=router; 