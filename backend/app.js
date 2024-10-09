import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import router from './router/router.js'
import morgan from 'morgan'
import connectToDB from './db/dbConnection.js';
connectToDB();
const app = express();

app.use(morgan('combined'));
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use('/',router);

export default app;