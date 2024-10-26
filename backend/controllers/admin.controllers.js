import User from '../models/user.model.js'
import Course from '../models/course.model.js'
import courseMapModel from '../models/courseMap.model.js';
const getUserAccount = async(req,res)=>{
    const user = await User.find({});
    if(!user){
        res.status(400).json({
            success:false,
            message:"something went wrong"
        })
    }

    res.status(200).json({
        success:true,
        message:"successful",
        user
    })
}

const assignRole = async(req,res)=>{
    const {id, role} = req.body;
    if(!(role && id)){
        res.status(400).json({
            success:true,
            message:"Role and Id are required"
        })
    }
    const user = await User.findById(id);
    if(!user){
        res.status(400).json({
            success:false,
            message:`user with ${id} doesn't exist`
        })
    }

    user.role = role;
    await user.save();
    res.status(200).json({
        success:true,
        message:"user details updated",
        user
    })
}

const addCourse = async(req,res)=>{
    const {courseName, courseCode, semester} = req.body;
    if (!(courseName && courseCode && semester)) {
        return res.status(400).json({
            success: false,
            message: "CourseName, CourseCode, and Semester are required",
        });
    }
    try{
        const course = await Course.create({
            semester,
            courseName,
            courseCode
        })
        return res.status(200).json({
            success:true,
            message:`Course ${courseName} added successfully`
        })
    }catch(err){
        console.log(err.message);
        return res.status(400).json({
            success:false,
            message:"course was not added to the list",
        })
    }
}

const deleteUser = async(req,res)=>{
    const id = req.body.id;
    const user = await User.findById(id);
    if(!user){
        return res.status(400).json({
            success:false,
            message:"invalid id"
        })
    }
    if(user.role === "ADMIN"){
        return res.status(400).json({
            success:false,
            message:"can't delete an Admin"
        })
    }
    try{
        await User.deleteOne({ _id:id });
        res.status(200).json({
            success:true,
            message:"user deleted successfully",
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:"cant delete the user"
        })
    }
}

const coursesToVerify = async(req,res)=>{
    console.log("in course fetch")
    try{
        const CoursesToVerify = await courseMapModel.find({});
        res.status(200).json({
            success:true,
            message:"All request fetched successfully",
            CoursesToVerify
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:"something went wrong while fetching course!!! Try again"
        })
    }
}

const verifyCourse = async(req, res)=>{
    try{
        const {verify, id} = req.body;
        if(!id || !verify){
            return res.status(400).json({
                success:false,
                message:"Enter all credentials"
            })
        }
        const courseMap = await courseMapModel.findById(id);
        if(!courseMap){
            return res.status(400).json({
                success:false,
                message:"Enter correct credentials"
            })
        }

        courseMap.approved = verify;
        courseMap.save();
        res.status(200).json({
            success:true,
            message:"Course request handled",
            courseMap
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}

export {
    getUserAccount,
    assignRole,
    deleteUser,
    addCourse,
    coursesToVerify,
    verifyCourse
}