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
        data:user
    })
}

const assignRole = async(req,res)=>{
    const {id, role} = req.body;
    if(role!=='STUDENT' && role!=="ADMIN" && role!=="PROFESSOR"){
        return res.status(400).json({
            success:false,
            message:`${role} is not a valid role`
        })
    }
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
        data:user
    })
}

const addCourse = async(req,res)=>{
    const {courseName, courseCode, semester, branch} = req.body;
    if (!(courseName && courseCode && semester && branch)) {
        return res.status(400).json({
            success: false,
            message: "CourseName, CourseCode, Semester and branch are required",
        });
    }

    const course = await Course.findOne({
        $or: [
          { courseName: courseName },
          { courseCode: courseCode }
        ]
      });

    if(course){
        console.log("course :",course)
        return res.json({
            success:false,
            message:"course with the name or code already exists"
        })
    }
    try{
        const course = await Course.create({
            semester,
            courseName,
            courseCode,
            branch
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
    const {id} = req.body;
    console.log(" id : ",id);
    const user = await User.findById(id);
    console.log("user : ",user);
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
        const users = await User.find({});
        res.status(200).json({
            success:true,
            message:"user deleted successfully",
            data:users
        })
    }catch(err){
        const users = await User.find({});
        res.status(400).json({
            success:false,
            message:"cant delete the user",
            data:users
        })
    }
}
const coursesToVerify = async (req, res) => {
    console.log("Fetching courses to verify");
    try {
        // Fetch courses that are not approved
        const CoursesToVerify = await courseMapModel.find({ approved: false })
            .populate('user_id', 'name email') // Optional: to get user details
            .populate('course_id', 'courseName'); // Optional: to get course details

        res.status(200).json({
            success: true,
            message: "Unapproved courses fetched successfully",
            data: CoursesToVerify,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Something went wrong while fetching courses! Try again",
        });
    }
};


const verifyCourse = async (req, res) => {
    try {
        const { verify, id } = req.body;
        if (id === undefined || verify === undefined) {
            return res.status(400).json({
                success: false,
                message: "Enter all credentials",
            });
        }
        const courseMap = await courseMapModel.findById(id);
        if (!courseMap) {
            return res.status(400).json({
                success: false,
                message: "Course not found",
            });
        }

        courseMap.approved = verify;
        await courseMap.save();

        res.status(200).json({
            success: true,
            message: verify ? "Course approved" : "Course disapproved",
            courseMap,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};


export {
    getUserAccount,
    assignRole,
    deleteUser,
    addCourse,
    coursesToVerify,
    verifyCourse
}