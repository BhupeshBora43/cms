import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';
const isLoggedIn = async (req, res, next) => {
    const { token } = req.cookies;
    if(!token){
        return res.status(403).json({
            success:false,
            message:"Token not found"
        })
    }
    try {
        const userDetails = await jwt.verify(token, process.env.SECRET)
        if (!userDetails) {
            console.log("invalid token")
            return res.status(401).json({
                success: false,
                message: "Incorrect credentials"
            })
        }

        const id = userDetails.id;
        const data = await User.findById(id);
        req.user = data;

        next();
    } catch (e) {
        console.log("invalid token")
        return res.status(401).json({
            success: false,
            message: "Incorrect credentials"
        })
    }
}

export default isLoggedIn;