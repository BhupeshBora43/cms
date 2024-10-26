import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';
const isLoggedIn = async (req,res,next)=>{
    console.log("is in logged in");
    const {token} = req.cookies;
    if(!token){
        console.log("invalid token")
        return res.status(500).json({
            success:false,
            message:"Incorrect credentials"
        })
    }

    const userDetails = await jwt.verify(token, process.env.SECRET)

    const id = userDetails.id;
    const data = await User.findById(id);
    req.user = data;

    next();
}

export default isLoggedIn;