if(process.env.NODE_ENV != "production"){
    require('dotenv').config() //ya dotnev ek npm package h jo .env file ko access krna m help krta h .
}
// console.log(process.env.SECRET) ;


const express =require("express");
const app = express();
const mongoose =require("mongoose");
const path = require("path");
const methodOverride=require("method-override");
const ejsmate =require("ejs-mate");//ya help krta bhut sara layout ko create krna m unko bar-bar create krna ki jarurat nhi padti h
const ExpressError = require("./utils/ExpressError.js");
const session  =require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const wrapAsync = require("./utils/wrapAsync.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"/public")))
const Listing = require("./models/listing.js");


// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

const dburl = process.env.ATLASDB_URL;


main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(dburl);
};




const store =  MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOption ={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    //cookies ki expire date bhi set kr skta h isma
    cookie:{
        expires:Date.now()+7*24*60*60*1000,//ya 1 week baad delete hogi ya 1 week ka etna milesecond h.
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};


// app.get("/",(req,res)=>{
//     res.send("hi , iam root");
   
// });





app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());//sabhi request ka liya passport initialize kr diya h.
app.use(passport.session());//user ek session m ek baar login kra baar na krna pada usa.
passport.use(new LocalStrategy(User.authenticate()));//user ko authenticate krana k liya iska use krta h.

passport.serializeUser(User.serializeUser());//user ki info ko seesion m store krana hi serialization hota h
passport.deserializeUser(User.deserializeUser());//jab session m sa delete krna ho to jo store kra h tab deserialization ka use krta h .

app.use((req,res,next)=>{
    res.locals.sucess = req.flash("sucess");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"Harsh vats"//ya schema m nhi define kiya . ya passport-local-mongoose na add kiya h automatically.
//     });
//    let registerdUser = await  User.register(fakeUser,"helloworld");//ya datbase m hamara data save kra dega.(or ya "helloworld"hamara password h)
//    res.send(registerdUser);
// })


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.get('/search',wrapAsync(async(req,res)=>{
    const{title}=req.query;
   
    let listing =[];

   
    if(title){
        listing=await Listing.find({title: { $regex: title, $options: 'i' }
        }).populate({path:"review",populate:{path:"author",}}).populate("owner");

    }
    if(listing.length === 0){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
      }
  
   res.render("listings/search.ejs",{listing})
  
}))




// app.get("/testListing",async (req,res)=>{
//     let samplelisting = new Listing({
//         title:"my new villa",
//         description:"by the beach",
//         price:2300,
//         location:"calangute, Goa",
//         country:"india",


//     });
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("sucessful testing");
// });

//jab koi random route p request bhejaga tab ya hoga

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found beta ji "))
})


//error handeling k liya iska use kraga
app.use((err,req,res,next)=>{
    let{statusCode = 500,message="something went wrong"}=err;

    res.status(statusCode).render("error.ejs",{message});
    // res.send(message).status(statusCode)
    // res.send("something went wrong");

});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});