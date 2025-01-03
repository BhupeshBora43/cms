import express from "express";

const router = express.Router();
import { register, login, about, editUserDetails, updatePassword, requestCourse, getAttendanceList, markAttendance, viewAttendance, addCourseSynopsis, viewCourses, getUserCourses, courseStatus } from '../controllers/user.controllers.js';

import upload from '../middleware/multer.middleware.js'
import isLoggedIn from '../middleware/isLoggedIn.middleware.js'
import checkRole from "../middleware/role.middleware.js";
router.get('/',(req,res)=>{
    res.send("welcome!!!")
})

router.post('/register', register);
router.post('/login',login);
router.get('/about', isLoggedIn, about)
router.post('/editUserDetails', isLoggedIn, upload.single('avatar'), editUserDetails);
router.post('/updatePassword', isLoggedIn, updatePassword);
router.post('/viewCourses',isLoggedIn,viewCourses)
router.post('/requestCourse',isLoggedIn,requestCourse)
router.post('/getAttendanceList',isLoggedIn,checkRole("PROFESSOR"),getAttendanceList);
router.post('/markAttendance',isLoggedIn,checkRole("PROFESSOR"),markAttendance);
router.post('/viewAttendance',isLoggedIn,viewAttendance)
router.post('/addCourseSynopsis',isLoggedIn,checkRole("PROFESSOR"),upload.single('file'), addCourseSynopsis);
router.post('/getUserCourses',isLoggedIn,getUserCourses);
router.get('/courseStatus',isLoggedIn,courseStatus);



export default router;