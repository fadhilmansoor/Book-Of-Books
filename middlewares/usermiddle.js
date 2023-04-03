const loginuser = async(req,res,next)=>{
try {
    if(req.session.userid){
        return res.redirect('/')
    }else{

    }
next();
}catch(error){
console.log(error.message)
}
}


module.exports={
loginuser
} 