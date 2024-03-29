import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.routes.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cookieParser());

const PORT =process.env.PORT || 5002;

mongoose.connect(process.env.MONGO)
.then(()=>app.listen(PORT,()=>console.log(`server running on port ${PORT}`)))
.catch((error)=> console.log('erar => ', error.message));



app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);

//to do more professional middleware
app.use(express.static(path.join(__dirname,'/client/dist')));

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'));
});

app.use((err,req,res,next)=>{
    const statusCode= err.statusCode ||500;
    const message =err.message;
    return res.status(statusCode).json({
        success:false,
        statusCode:statusCode,
        message:message
    });
});