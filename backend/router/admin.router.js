import express from "express";
import {  addCourse, assignRole, coursesToVerify, deleteUser,getUserAccount, verifyCourse } from "../controllers/admin.controllers.js";
import checkRole from "../middleware/role.middleware.js";
import isLoggedIn from "../middleware/isLoggedIn.middleware.js";

const router = express.Router();

router.use(isLoggedIn, checkRole("ADMIN"));

router.get('/getUserAccount', getUserAccount);

router.post('/assignRole', assignRole);

router.post('/addCourse', addCourse);

router.post('/deleteUser', deleteUser);

router.get('/coursesToVerify', coursesToVerify)

router.post('/verifyCourse', verifyCourse)

export default router;