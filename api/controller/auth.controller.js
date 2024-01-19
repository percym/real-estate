import User from '../models/usermodel.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {errorHandler} from '../utils/error.js';


export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json('User created successfully');
    } catch (error) {
        // next(errorHandler(550,'error from the function'))
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email: email });
        if (!validUser) { return next(errorHandler(404, 'user not found')); };
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) { return next(errorHandler(401, 'invalid credentials')) };
        const { password: pass, ...userInfoWithoutPassword } = validUser._doc;
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        res
            .cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
            .status(200)
            .json(userInfoWithoutPassword);
    } catch (error) {
        next(error)
    }

} ;

export const google =async (req, res, next )=>{
    try {
        const user = await User.findOne({email:req.body.email});
        if(user){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const { password: pass, ...userInfoWithoutPassword } = validUser._doc; 
          res
            .cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
            .status(200)
            .json(userInfoWithoutPassword);
        }else{
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) ;
            const hashedPassword = bcryptjs.hashSync(generatePassword,10);
            const formattedUsername = req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
            const newUser = new User({username:formattedUsername, email:req.body.email, password:hashedPassword, avatar:req.body.photoUrl});
            await newUser.save();
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const { password: pass, ...userInfoWithoutPassword } = newUser._doc; 
          res
            .cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
            .status(200)
            .json(userInfoWithoutPassword);

        }
    } catch (error) {
        next(error);
        
    }
};