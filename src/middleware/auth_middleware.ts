import { validateAccessToken } from "../utils/tokens.ts";

 
export const authMiddleware=(req:any,res:any,next:any)=>{  
const accessToken=req?.cookies?.accessToken;
try { 
    const verifyUser=validateAccessToken(accessToken);
    if(verifyUser[0]){
    req.user=verifyUser[1] as object; 
    return next();
}else{
    return res.status(401).json({"message":"access token expired"});
}
} catch (error) {
    return res.status(401).json({"message":"Token MisMatch"});
}
}