import express from 'express';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary'
import fs from 'fs/promises'
import User from '../models/user.model.js'
import courseMap from '../models/courseMap.model.js'
import Course from '../models/course.model.js'
import mongoose from 'mongoose';
import Attendance from '../models/attendence.model.js'

const register = async(req,res) =>{
    const {name,email,password} = req.body;
    if(!(name && email && password))
    {
        return res.status(500).json({
            success:false,
            message:"All fields are required"
        });
    }

    try{
        const user = await User.create({
            name,
            email,
            password
        });
        console.log("here ");
        return res.status(200).json({
            success:true,
            message:"user created successfully"
        });
    }catch(err){
        console.log(err.message);
        return res.status(400).json({
            success:false,
            message:"registration unsuccessful"
        });
    }
}

const login = async(req,res)=>{
    const {email,password} = req.body;
    if(!(email && password))
    {
        return res.status(500).json({
            success:false,
            message:"all credential are required"
        })
    }
    try{
        const user = await User.findOne({email}).select('+password')

        if(!user){
            return res.status(400).json({
                success:false,
                message:"please enter valid credential"
            })
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message:"please enter valid credential"
            })
        }
        user.password = undefined;
        const token = user.jwtToken();
        const cookieOptions = {
            maxAge: 3600000,
            httpOnly:true,
        }

        res.cookie('token',token,cookieOptions);

        res.status(200).json({
            success:true,
            data:user,
            message:'user logged in successfully',
        })
    }catch(err){
        return res.status(400).json({
            success:false,
            message:err.message
        })
    }
}

const about = async function(req,res){
    try{
        const userId = req.user.id;
        const user = await User.findById(userId)
        res.status(200).json({
            success:true,
            user
        })
    } catch(err){
        return res.status(500).json({
            success:false,
            message:"Enter valid credential",
        })
    }
}

const editUserDetails = async function (req, res){
    const email = req.user.email;
    console.log(" in edit ");
    const user = await User.findOne({email});
    const { name } = req.body;
    if(name){
        try{
            user.name = name;
            user.save();
        }catch(err){
            return res.status(400).json({
                success:false,
                message:"failed to change the name"
            })
        }
    }
    console.log(" file ",req.file);
    if(req.file){
        try{
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'profile_pictures',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            })
            if(result)
            {
                console.log("Full result = ", JSON.stringify(result, null, 2));
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;
                console.log("secure url = ",user.avatar.secure_url);

                console.log("removing file");
                await user.save();
                fs.rm(`../uploads/${req.file.filename}`);
            }
        }catch(e){
            res.status(400).json({
                success:false,
                message:"please reupload the image"
            })
        }
    }
    res.status(200).json({
        success:true,
        message:"User details updated successfully",
        data:user
    })
}

const updatePassword = async function(req,res){
    // previous password required for auth
    const {password} = req.body;
    if(!password){
        res.status(400).json({
            message:"Enter new password"
        })
    }
    const email = req.user.email;
    const user = await User.findOne({email});
    user.password = password;
    await user.save();
    res.status(200).json({
        user
    })
}


const requestCourse = async(req,res)=>{
    const {course_id} = req.body;
    console.log(req.user);
    const role = req.user.role;
    if(!course_id){
        return res.status(200).json({
            success:false,
            message:"All credentials are required"
        })
    }

    const course = await Course.findById(course_id);
    // if(role==="STUDENT"){
    //     const semester = req.body.semester;
    //     console.log("semester",semester, course.semester);
    //     if(semester !== course.semester){
    //         return res.status(400).json({
    //             success:false,
    //             message:"Course of another semester is being requested"
    //         })
    //     }
    // }

    try{
        const user_id = req.user.id;
        const semester = course.semester;
        const course_map = new courseMap({
            user_id,
            course_id,
            semester
        })
        await course_map.save();
        return res.status(200).json({
            success:true,
            message:"Request for the course has been registered"
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:"something went wrong while registering for course"
        })
    }
}

const getAttendanceList = async (req, res) => {
    const {course_id} = req.body;
    if (!course_id) {
        return res.status(400).json({
            success: false,
            message: "Enter courseId"
        });
    }

    const user_id = req.user.id;

    const valid = await courseMap.findOne({
        user_id,
        course_id
     });
    if (!valid) {
        return res.status(400).json({
            success: false,
            message: "Invalid authorization"
        });
    }

    const users = await courseMap.aggregate([
        { $match: {
            course_id: new mongoose.Types.ObjectId(course_id)
         } },
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        { $unwind: "$userDetails" },
        { $match: { "userDetails.role": "STUDENT" } },
        {
            $project: {
                user_id: 1,
                courseId: 1,
                "userDetails.name": 1,
                "userDetails.email": 1,
            }
        }
    ]);

    return res.status(200).json({
        success: true,
        users
    });
};

const markAttendance = async(req,res)=>{
    const {attendanceArray, course_id} = req.body;
    //check for the validation of attendance array
    //in case all the attendance aren't marked mark them true by default for students enrolled in the course
    console.log(attendanceArray,course_id);
    if(!course_id){
        return res.status(400).json({
            success:false,
            message:"Course Id not available"
        })
    }

    const user_id = req.user.id;
    const courseDetails = await courseMap.find({user_id, course_id})

    if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"invalid authorization"
            })
    }

    const newAttendance = await Attendance.create({
        course_id,
        students:attendanceArray
    })

    res.status(200).json({
        success:true,
        message:"attendance marked successfully",
        newAttendance
    })
}

const viewAttendance = async(req,res)=>{
    const {course_id} = req.body;
    if(!course_id){
        return res.status(400).json({
            success:false,
            message:"Provide valid course_id"
        })
    }

    try{
        const user_id = req.user.id;
        const role = req.user.role;
        const hasCourse = courseMap.find({course_id, user_id});
        if(!hasCourse){
            return res.status(400).json({
                success:false,
                message:"the user is not authorized to access the attendance list"
            })
        }
        const totalAttendenceToDate = await Attendance.find({course_id})
        if(role==="PROFESSOR")return res.status(200).json({
            success:true,
            message:"Successfully retrieved data",
            totalAttendenceToDate
        })

        const totalAttendanceOfUser = totalAttendenceToDate.map((value)=>{
            const res = value.students.filter((inval)=> inval.student_id == user_id);
            return res;
        })
        return res.status(200).json({
            success:true,
            message:"Successfully retrieved data",
            totalAttendanceOfUser
        })
    }catch(err){
        return res.status(400).json({
            success:false,
            message:"Something went wrong while fetching attendance record"
        })
    }
}

const addCourseSynopsis = async(req,res)=>{
    const {course_id,description} = req.body;
    const course = await Course.findById(course_id);
    if(!course){
        return res.status(400).json({
            success:false,
            message:"valid course_id is required"
        })
    }

    const user_id = req.user.id;
    const isValid = courseMap.find({user_id,course_id});
    if(!isValid){
        return res.status(400).json({
            success:false,
            message:"unauthorized access"
        })
    }
    try{
        if(description){
            course.description = description;
            course.save();
        }
    }catch(err){
        console.log(err.message);
        return res.status(400).json({
            success:false,
            message:"something went wrong"
        })
    }
    if(req.file){
        try{
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                resource_type: 'video',
                folder: 'course_synopsis'
            })
            if(result)
            {
                console.log("Full result = ", JSON.stringify(result, null, 2));
                course.video.public_id = result.public_id;
                course.video.secure_url = result.secure_url;
                console.log("secure url = ",course.video.secure_url);

                console.log("removing file");
                await course.save();
                fs.rm(`../uploads/${req.file.filename}`);
            }
        }catch(e){
            console.log(e.message);
            return res.status(400).json({
                success:false,
                message:"please reupload the synopsis"
            })
        }
    }
    res.status(200).json({
        success:true,
        message:"course details updated successfully",
        course
    })
}


export{
    register,
    login,
    about,
    editUserDetails,
    updatePassword,
    requestCourse,
    getAttendanceList,
    markAttendance,
    viewAttendance,
    addCourseSynopsis
}