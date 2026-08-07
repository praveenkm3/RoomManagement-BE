

 
export const adminMiddleware=(req:any,res:any,next:any)=>{   
try { 
    const user=req.user; 
    console.log(user);
    if(user.role === 'Admin'){
        return next();
    }else{
        return res.status(400).json({"message":"UnAuthorized Attempt"});
    }
    
}
catch (error) {
    return res.status(401).json({"message":"Error At Checking Admin details"});
}
}