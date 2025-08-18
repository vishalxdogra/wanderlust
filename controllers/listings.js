const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const map_token=process.env.MAP_API_KEY;
const geocodingClient = mbxGeocoding({ accessToken: map_token });


module.exports.index=async(req,res)=>{
    const listingdata= await Listing.find({});
    res.render("./listings/index.ejs",{listingdata});
}

module.exports.search=async (req, res) => {
    let { q } = req.query;
    let query = {};
    if (q) {
      query = {
        $or: [
          { title: new RegExp(q, "i") },
          { description: new RegExp(q, "i") },
          {location: new RegExp(q, "i") }
        ]
      };
    }
  
    let listingdata = await Listing.find(query);
    res.render("./listings/index.ejs", { listingdata, q });
  }

module.exports.newlistingForm=(req,res)=>{
    let {data}=req.params;
    //console.log(data);
    res.render("./listings/new.ejs");
}
module.exports.postnew=async(req,res)=>{
    let response=await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()

    const { path: url, filename } = req.file;
    const newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    // console.log(url);
    // console.log(filename);
    newlisting.geometry=response.body.features[0].geometry;
    await newlisting.save();
    req.flash("success","Listing added successfully");
    res.redirect('/listings');

}

module.exports.showRoute=async (req, res) => {
    const { id } = req.params;
    const datalist = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }, 
        })
        .populate("owner");

    if (!datalist) {
        req.flash("error", "Listing not Found");
        return res.redirect('/listings'); 
    }

    res.render("./listings/show.ejs", { datalist });
};


module.exports.getUpdate=async(req,res)=>{
    const {id}=req.params;
    const datalist= await Listing.findById(id);
    if(!datalist){
        req.flash("error","listing you requested doesnot found");
        res.redirect('/listings');
    }
    let originalImageUrl=datalist.image.url;
    originalImageUrl=originalImageUrl.replace('/upload', "/upload/h_300,w_250");
    res.render("./listings/edit.ejs",{datalist,originalImageUrl});
}

module.exports.postupdate=async(req,res)=>{
    if(!req.body.listing){
        throw new express_error(400,"title is required");
    }
    const {id}=req.params;
   
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});     // {...}for deconstruct of the objects of the listing
    if(typeof req.file!== "undefined"){
        const { path: url, filename } = req.file;
        listing.image={url,filename};
        await listing.save();
    }


    req.flash("success","Listing edited successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.deletelisting=async(req,res)=>{
    const {id}=req.params;
    const datalist= await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully");
    //console.log(datalist);
    res.redirect('/listings');
};