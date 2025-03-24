const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("./schema.js");

//ya ek middlware bna diya jo check kraga user login h ya nhi .
// or isko as a middlware ham pass krega new,update,delete asa routes m jha need h iski.
// req.user ki help sa ham ya check kr skta h ki ham log in h ya nhi jab vo undifined value da 
// to vo log in nhi h or jab vo koi obj return kra to  vo log in h.
//passport sari user ki info (req) m save krata h 
    // console.log(req.user);
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){ //ya check krta h user already database m h ya nhi (login h ya nhi h) us particular session k liya .
    //  yadi nhi h to ya flash msg show hoga.or jasa koi addkrna gya listinig  usa phela vo login krvaya ga or uska baad vo 
    // usi page p redirect krda  to ham ya use krta h req m orignalUrl method pr redirect kr deta h. .
req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing");
       return res.redirect("/login");
    };
    next();
}
//ya locals m isliya save kraya kyu ki passport login krna ka 
// baad automatically seesion ko reset krdeta h or locals m save 
// kra diya to vo vha sa nhi kr paya ga.

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//is middlware ka kam h jo listing h uska owner h ya nhi vo.
module.exports.isOwner = async (req,res,next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listing");
       return res.redirect(`/listings/${id}`); //return nhi kraya to ya nicha ka sara code bhi run hoga.
    };
    next();
};


module.exports.validateListing = (req,res,next)=>{
    let {error} =   listingSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let {error} =   reviewSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

//is middlware ka kam h jo listing h uska owner h ya nhi vo.
module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id, reviewId}=req.params;
    let review = await Review.findById( reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of this Review");
       return res.redirect(`/listings/${id}`); //return nhi kraya to ya nicha ka sara code bhi run hoga.
    };
    next();
};