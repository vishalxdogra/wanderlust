const mongoose=require("mongoose");
const reviews = require("./reviews");
const Schema=mongoose.Schema;
const review=require('./reviews.js');
const listingschema= new Schema({
    title:{
        type:String,
        required:true,
    },
    description: String,
    image:{
        url:String,
        filename:String
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        
            type: {
              type: String, 
              enum: ['Point'], 
              required: true
            },
            coordinates: {
              type: [Number],
              required: true
            }
          }
    
});

listingschema.post('findOneAndDelete',async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.reviews}});
    }
})


const Listing=mongoose.model("listing",listingschema);

module.exports=Listing;