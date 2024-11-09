import { Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";


export default function App(){
    return (
        <Routes>
            <Route path="/" element={<Homepage/>}/>

            <Route path="/login" element={<Login/>}/>

            <Route path="/signup" element={<Signup/>}/>
        </Routes>
    )
}