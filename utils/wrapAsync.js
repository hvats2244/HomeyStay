
//try catch ko likhna ka better trika h 

module.exports=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch((err)=> next(err));

    }
}