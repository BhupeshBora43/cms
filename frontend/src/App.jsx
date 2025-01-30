import { Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Layout from "./Layouts/Layout";
import Profile from "./Pages/Profile";
import Dashboard from "./Pages/Dashboard";
import AddCourse from "./Pages/AddCourse";
import AssignRole from "./Pages/AsignRole";
import DeleteUser from "./Pages/DeleteUser";
import CourseView from "./Pages/CourseView";
import AdminGetUsers from "./Pages/AdminGetUsers";
import CourseVerification from "./Pages/AdminVerifyCourse";
import CourseList from "./Pages/UserViewCourse";
import ViewAttendance from "./Pages/ViewAttendance";
import MarkAttendance from "./Pages/MarkAttendance";
import CourseSynopsis from "./Pages/AddEditSynopsis";
import RequestCourse from "./Pages/UserRequestCourse";
import LogoutListener from "./Helpers/isLoggedInEvent";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App(){
    return (
        <Layout>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
                <LogoutListener />
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/addCourse" element={<AddCourse />} />
                    <Route path="/assignRole" element={<AssignRole />} />
                    <Route path="/deleteUser" element={<DeleteUser />} />
                    <Route path="/viewCourse" element={<CourseView />} />
                    <Route path="/viewUsers" element={<AdminGetUsers />} />
                    <Route path="/verifyCourse" element={<CourseVerification />} />
                    <Route path="/courseList" element={<CourseList />} />
                    <Route path="/markAttendance/:course_id" element={<MarkAttendance />} />
                    <Route path="/viewAttendance" element={<ViewAttendance />} />
                    <Route path="/addSynopsis/:courseMapId" element={<CourseSynopsis />} />
                    <Route path="/requestCourse" element={<RequestCourse />} />
                </Routes>
            </GoogleOAuthProvider>
        </Layout>
    );
}
