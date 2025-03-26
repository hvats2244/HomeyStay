const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        require:true,

    },
    description:String,
    image:{   
             url:String,
             filename:String,
        
       // type: String,
        // default:"https://st2.depositphotos.com/4164031/7029/i/450/depositphotos_70298419-stock-photo-deep-space.jpg",

        // set:(v)=> v === ""?"https://st2.depositphotos.com/4164031/7029/i/450/depositphotos_70298419-stock-photo-deep-space.jpg": v,  //default value asa bhi set kr skta h
    },
    price:Number,
    location:String,
    country:String,
    //mongoose relationship ka concpet h
    review :[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    },
],
owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
},

//ya mongoose sa geojson formate laya h.
geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
//   //ya new feature add krna k liya h.
//   category:{
//     type:String,
//     enum:["mountain","arctic","farms","rooms","deserts"]
//   }
            
});

//jab listing delete hogi uska sath reviewId bhi delete hojaya gi (means reviews bhi delete hojaya ga sara database sa)
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
await Review.deleteMany({_id : {$in:listing.review}});

    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports =  Listing;