const User = require("../models/user.js");


module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
    };


module.exports.signup = async (req,res)=>{
    try{
        let{username,email,password} = req.body;
        const newUser = new User({email,username});
       const registerdUser =await User.register(newUser,password);
       console.log(registerdUser);
       req.login(registerdUser,(err)=>{ //ya bhi passport ka method h  jo user ko sign up ka baad login  krvata h automatically.
        if(err){
            return next(err);
        };
        req.flash("sucess","Welcome to wonderlust!");
        res.redirect("/listings");
       });
           

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");

    }
   
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};


module.exports.login = async(req,res)=>{ //passport.authenticate ek middelware jo authenticate kra h ki user phela sa exits krta h ya nhi.
    // phela ya middelware run hoga then ya succesful hu then async(req,res)pr jaya ga.
                                                                                                                       
     req.flash("sucess","welcome back to HomeyStay!");
    
     let redirectUrl = res.locals.redirectUrl || "/listings";
     res.redirect(redirectUrl);
    };

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{ // passport help krta h log out m is method ki help sa or logout ka 
                       //  badd kya action perform hona chiya vo is callback m likhta h .

        if(err){
            return next(err);
        }
        req.flash("sucess","you are logged out");
        res.redirect("/listings");
    })
};