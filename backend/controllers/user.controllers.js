import express from 'express';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary'
import fs from 'fs/promises'
import User from '../models/user.model.js'
import courseMap from '../models/courseMap.model.js'
import Course from '../models/course.model.js'
import mongoose from 'mongoose';
import Attendance from '../models/attendence.model.js'
import courseMapModel from '../models/courseMap.model.js';

const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!(name && email && password)) {
        return res.status(500).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        const user = await User.create({
            name,
            email,
            password
        });
        console.log("here ");
        return res.status(200).json({
            success: true,
            message: "user created successfully"
        });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            success: false,
            message: "registration unsuccessful"
        });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(500).json({
            success: false,
            message: "all credential are required"
        })
    }
    try {
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "please enter valid credential"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "please enter valid credential"
            })
        }
        user.password = undefined;
        const token = user.jwtToken();
        const cookieOptions = {
            maxAge: 36000000,
            httpOnly: true,
        }

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            success: true,
            data: user,
            message: 'user logged in successfully',
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

const about = async function (req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId)
        res.status(200).json({
            success: true,
            user
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Enter valid credential",
        })
    }
}

const editUserDetails = async function (req, res) {
    const email = req.user.email;
    console.log(" in edit ");
    const user = await User.findOne({ email });
    const { name } = req.body;
    if (name) {
        try {
            user.name = name;
            user.save();
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "failed to change the name"
            })
        }
    }
    console.log(" file ", req.file);
    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'profile_pictures',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            })
            if (result) {
                console.log("Full result = ", JSON.stringify(result, null, 2));
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;
                console.log("secure url = ", user.avatar.secure_url);

                console.log("removing file");
                await user.save();
                fs.rm(`../uploads/${req.file.filename}`);
            }
        } catch (e) {
            res.status(400).json({
                success: false,
                message: "please reupload the image"
            })
        }
    }
    res.status(200).json({
        success: true,
        message: "User details updated successfully",
        data: user
    })
}

const updatePassword = async function (req, res) {
    // previous password required for auth
    const { password } = req.body;
    if (!password) {
        res.status(400).json({
            message: "Enter new password"
        })
    }
    const email = req.user.email;
    const user = await User.findOne({ email });
    user.password = password;
    await user.save();
    res.status(200).json({
        user
    })
}


const requestCourse = async (req, res) => {
    const { course_id } = req.body;
    console.log(req.user);
    const role = req.user.role;
    if (!course_id) {
        return res.status(200).json({
            success: false,
            message: "All credentials are required"
        })
    }

    const course = await Course.findById(course_id);

    try {
        const user_id = req.user.id;
        const semester = course.semester;
        const course_map = new courseMap({
            user_id,
            course_id,
            semester
        })
        await course_map.save();
        return res.status(200).json({
            success: true,
            message: "Request for the course has been registered"
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "something went wrong while registering for course"
        })
    }
}


const getAttendanceList = async (req, res) => {
    const { course_id } = req.body;
    if (!course_id) {
        return res.status(400).json({
            success: false,
            message: "Enter courseId"
        });
    }

    const user_id = req.user.id;
    const courseObjectId = new mongoose.Types.ObjectId(course_id);
    const userObjectId = new mongoose.Types.ObjectId(user_id);

    const valid = await courseMap.findOne({
        user_id: userObjectId,
        course_id: courseObjectId
    });

    if (!valid) {
        return res.status(400).json({
            success: false,
            message: "Invalid authorization"
        });
    }

    const users = await courseMap.aggregate([
        {
            $match: {
                course_id: courseObjectId
            }
        },
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
        data: users
    });
};

const markAttendance = async (req, res) => {
    const { attendanceArray, course_id } = req.body;
    if (!course_id) {
        return res.status(400).json({
            success: false,
            message: "Course Id not available",
        });
    }

    const user_id = req.user.id;

    const courseObjectId = new mongoose.Types.ObjectId(course_id);
    const userObjectId = new mongoose.Types.ObjectId(user_id);

    const courseDetails = await courseMap.findOne({
        user_id: userObjectId,
        course_id: courseObjectId
    });

    if (!courseDetails) {
        return res.status(400).json({
            success: false,
            message: "Invalid authorization",
        });
    }

    const enrolledStudents = await courseMap.find({
        course_id: courseObjectId
    });

    const studentsAttendance = enrolledStudents.map((student) => {
        return {
            student_id: student.user_id,
            flag: attendanceArray.includes(student.user_id.toString())
        };
    });

    const newAttendance = await Attendance.create({
        course_id: courseObjectId,
        students: studentsAttendance,
    });

    res.status(200).json({
        success: true,
        message: "Attendance marked successfully",
        data: newAttendance,
    });
};

const viewAttendance = async (req, res) => {
    const { course_id } = req.body;
    if (!course_id) {
        return res.status(400).json({
            success: false,
            message: "Provide valid course_id"
        })
    }

    try {
        const user_id = req.user.id;
        const role = req.user.role;
        const courseObjectId = new mongoose.Types.ObjectId(course_id);
        const userObjectId = new mongoose.Types.ObjectId(user_id);
        const hasCourse = await courseMap.find({ course_id:courseObjectId, user_id:userObjectId });
        if (!hasCourse) {
            return res.status(400).json({
                success: false,
                message: "the user is not authorized to access the attendance list"
            })
        }
        const totalAttendanceToDate = await Attendance.find({ course_id: courseObjectId})
        const totalAttendanceTillNow = await Attendance.countDocuments({ course_id: courseObjectId });
        console.log("totalAttendanceToDate",totalAttendanceToDate);
        if (role === "PROFESSOR") return res.status(200).json({
            success: true,
            message: "Successfully retrieved data",
            data: totalAttendanceTillNow
        })
        const totalAttendanceOfUser = totalAttendanceToDate.map((value) => {
            const res = value.students.filter((inval) => inval.student_id == user_id);
            return res.filter((student) => student.flag === true).length;
        });
        console.log("totalAttendanceOfUser:", totalAttendanceOfUser);
        const totalAttendances = totalAttendanceOfUser.reduce((sum, count) => sum + count, 0);
        return res.status(200).json({
            success: true,
            message: "Successfully retrieved data",
            data: { totalAttendances, totalAttendanceTillNow }
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong while fetching attendance record"
        })
    }
}

const addCourseSynopsis = async (req, res) => {
    console.log("req.body :", req.body);
    const { course_id, description } = req.body;
    console.log("course_id :", course_id);
    const course = await Course.findById(course_id);
    if (!course) {
        return res.status(400).json({
            success: false,
            message: "valid course_id is required"
        })
    }

    const user_id = req.user.id;
    const isValid = courseMap.findOne({ user_id, course_id });
    if (!isValid) {
        return res.status(400).json({
            success: false,
            message: "unauthorized access"
        })
    }
    try {
        if (description) {
            course.description = description;
            course.save();
        }
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            success: false,
            message: "something went wrong"
        })
    }
    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                resource_type: 'video',
                folder: 'course_synopsis'
            })
            if (result) {
                console.log("Full result = ", JSON.stringify(result, null, 2));
                course.video.public_id = result.public_id;
                course.video.secure_url = result.secure_url;
                console.log("secure url = ", course.video.secure_url);

                console.log("removing file");
                await course.save();
                fs.rm(`../uploads/${req.file.filename}`);
            }
        } catch (e) {
            console.log(e.message);
            return res.status(400).json({
                success: false,
                message: "please reupload the synopsis"
            })
        }
    }
    res.status(200).json({
        success: true,
        message: "course details updated successfully",
        data: course
    })
}

const viewCourses = async (req, res) => {
    const { semester } = req.body;
    if (!semester) {
        const courses = await Course.find({});
        return res.status(200).json({
            success: true,
            message: "course fetched successfully",
            data: courses
        })
    }

    try {
        const courses = await Course.find({ semester });
        console.log("course: ", courses)
        res.status(200).json({
            success: true,
            message: "course fetched successfully",
            data: courses
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: `something went wrong while fetching course ${err.message}`
        })
    }
}

const getUserCourses = async (req, res) => {
    const { userId } = req.body;

    try {
        const userCourses = await courseMapModel
            .find({ user_id: userId })
            .populate('course_id', 'courseName courseCode semester branch video description')
            .populate('user_id', 'name')
            .lean();

        if (!userCourses.length) {
            return res.status(404).json({
                success: false,
                message: 'No courses found for this user'
            });
        }

        const coursesWithDetails = userCourses.map(course => ({
            courseMapId: course._id,
            userName: course.user_id?.name || 'N/A',
            courseName: course.course_id.courseName,
            courseCode: course.course_id.courseCode,
            semester: course.course_id.semester,
            branch: course.course_id.branch,
            description: course.course_id.description,
            video: course.course_id.video,
            approved: course.approved || false,
            course_id: course.course_id._id
        }));

        res.status(200).json({
            success: true,
            message: 'Courses fetched successfully',
            data: coursesWithDetails
        });
    } catch (err) {
        console.error('Error fetching user courses:', err.message);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


const courseStatus = async (req, res) => {
    try {
        const user_id = req.user.id;

        const courseMaps = await courseMap.find({ user_id });

        const courseStatus = {};
        for (let course of courseMaps) {
            courseStatus[course.course_id.toString()] = course.approved ? 'enrolled' : 'requested';
        }
        return res.status(200).json({
            success: true,
            data: courseStatus,
        });
    } catch (err) {
        console.error('Error fetching course statuses:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch course statuses',
        });
    }
};

export {
    register,
    login,
    about,
    editUserDetails,
    updatePassword,
    viewCourses,
    requestCourse,
    getAttendanceList,
    markAttendance,
    viewAttendance,
    addCourseSynopsis,
    getUserCourses,
    courseStatus
}