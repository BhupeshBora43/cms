import { Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Layout from "./Layouts/Layout";
import Profile from "./Pages/Profile";
import Dashboard from "./Pages/Dashboard";

export default function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Homepage />} />

                <Route path="/login" element={<Login />} />

                <Route path="/signup" element={<Signup />} />

                <Route path="/profile" element={<Profile />} />

                <Route path ="/dashboard" element={<Dashboard/>}/>
            </Routes>
        </Layout>
    )
}