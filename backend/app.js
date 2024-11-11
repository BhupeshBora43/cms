import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import router from './router/router.js'
import morgan from 'morgan'
import connectToDB from './db/dbConnection.js';
import AdminRouter from './router/admin.router.js';
connectToDB();
const app = express();

app.use(morgan('combined'));
app.use(cors({
    origin:true,
    credentials:true
}))
app.use(cookieParser())
app.use(express.json())
app.use('/admin',AdminRouter);
app.use('/user',router);
app.all('*',(req,res)=>{
    console.log("here in the last route");
    res.status(200).json({
        success:true,
        message:"in last route"
    })
})
export default app;