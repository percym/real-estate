import User from "../models/usermodel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test = (req,res)=>{
    res.send({message:'test route'});
};

export const updateUser = async (req,res,next)=>{
    console.log("cookies",req.cookies)
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your account'));
   try {
     if(req.body.password){
        req.body.password == bcryptjs.hashSync(req.body.password,10);
     }

     const updateUser = await User.findByIdAndUpdate(req.params.id,{
        $set:{
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            avatar:req.body.avatar,
        }
     }, {new:true});
     
     const {password,...theRestWithOutPassword}=updateUser._doc;
     res.status(200).json(theRestWithOutPassword);

   } catch (error) {
        next(error);
   }
     
};