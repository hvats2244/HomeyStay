//isma sara callback aya ga listing vala. ya better trika h represent krna ka.
const Listing = require("../models/listing.js");
const axios = require("axios");




module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
       
    };

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs")
    };
module.exports.showListing = async (req,res)=>{
    let{id}=req.params;
  const listing =  await Listing.findById(id).populate({path:"review",populate:{path:"author",}}).populate("owner");
  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  console.log(listing)
  res.render("listings/show.ejs",{listing});

};  

module.exports.createListing = async(req,res,next)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing")
    // }
    
    //new listing sa input lekr uska latitude or longitude nikala h isma 
    const location = req.body.listing.location;
      const url1 = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        location
      )}&apiKey=f89c8af0ab0c4aceb723a39ef61b79e5`;
  
      const response = await axios.get(url1);
      const data = response.data;
  

    let url = req.file.path;
    let filename =req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        // console.log(newListing);
        newListing.image = {url,filename};

        newListing.geometry = data.features[0].geometry;

       let savedListing = await newListing.save();
       console.log(savedListing);
        req.flash("sucess","New Listing Created!");
        res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
      }
      let originalImageUrl =listing.image.url;
      originalImageUrl =  originalImageUrl.replace("/upload","/upload/w_250")//cloudinary sa hi picture ki qualtiy kam krd deta h jisa jada loading time na ho.
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing")
    // } ab iski jgha ham validatelisting ka use kr rha h 
    let {id}=req.params;
   let listing =   await Listing.findByIdAndUpdate(id,{...req.body.listing});//(...req.body.listing) spreed property h
if(typeof req.file !== "undefined"){
   let url = req.file.path;
   let filename =req.file.filename;
   listing.image = {url,filename};
   await listing.save();
}
     req.flash("sucess","Listing Updated!");
    res.redirect(`/listings/${id}`);
    
};

module.exports.destroyListing = async (req,res)=>{
    let {id} =req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("sucess","Listing Deleted!");
    res.redirect("/listings");
};
    