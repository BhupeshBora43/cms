import jwt from 'jsonwebtoken'
console.log("called loggedin ?")
const isLoggedIn = async (req,res,next)=>{
    const {token} = req.cookies;
    console.log("Entered into isLoggedIn")
    if(!token){
        console.log("invalid token")
        return res.status(500).json({
            success:false,
            message:"Incorrect credentials"
        })
    }

    const userDetails = await jwt.verify(token, process.env.SECRET)

    req.user = userDetails;

    next();
}

export default isLoggedIn;