function checkRole(...AllowedRole){
    return (req,res,next)=>{
        const role = req.user.role;
        if(!AllowedRole.includes(role) ){
            res.status(400).json({
                success:false,
                message:"Access not allowed"
            })
            return;
        }
        next();
    }
}

export default checkRole;