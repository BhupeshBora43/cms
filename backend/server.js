import {config} from 'dotenv';
config();

import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
});

import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`server is up at http://localhost:${PORT}`)
})
