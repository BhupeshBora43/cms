import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { googleSignup, userSignup } from '../store/Slices/auth.slice';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const onUserInput = (e) => {
        const { value, name } = e.target;
        setData({
            ...data,
            [name]: value
        })
    }

    const OnSignup = async (e) => {

        e.preventDefault();

        const { email, password, name } = data
        if (!email || !password || !name) {
            return;
        }
        const res = await dispatch(userSignup(data))
        console.log("res in signup ",res.payload)
        if (res?.payload) {
            navigate("/");
        }
    }

    const handleGoogleSignup = async (response) => {
        const { credential } = response;

        const res = await dispatch(googleSignup({ tokenId: credential }));
        if (res?.payload) {
            navigate("/");
        } else {
            console.error('Google signup failed:', res?.error?.message || 'Unknown error');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="flex flex-col space-y-4 items-center">
                <form
                    onSubmit={OnSignup}
                    className="space-y-6 w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Sign Up</h2>

                    <input
                        required
                        onChange={onUserInput}
                        value={data?.name}
                        placeholder="Name"
                        className="border border-gray-300 rounded-lg outline-none w-full px-4 py-3 placeholder-gray-500 focus:ring focus:ring-blue-300"
                        type="text"
                        name="name"
                    />

                    <input
                        required
                        onChange={onUserInput}
                        value={data?.email}
                        placeholder="Email"
                        className="border border-gray-300 rounded-lg outline-none w-full px-4 py-3 placeholder-gray-500 focus:ring focus:ring-blue-300"
                        type="email"
                        name="email"
                    />

                    <input
                        required
                        onChange={onUserInput}
                        value={data?.password}
                        placeholder="Password"
                        className="border border-gray-300 rounded-lg outline-none w-full px-4 py-3 placeholder-gray-500 focus:ring focus:ring-blue-300"
                        type="password"
                        name="password"
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 text-white rounded-lg w-full py-3 font-semibold hover:bg-blue-700 transition duration-200">
                        Sign Up
                    </button>
                </form>

                <div className="mt-6 w-full max-w-md text-center ">
                    <div className="flex items-center space-x-2 justify-center mb-4">
                        <div className="w-1/3 border-t border-gray-300"></div>
                        <span className="text-gray-500 text-sm font-medium">or</span>
                        <div className="w-1/3 border-t border-gray-300"></div>
                    </div>

                    <GoogleLogin
                        onSuccess={handleGoogleSignup}
                        onError={(error) => console.log(error)}
                        size="large"
                        useOneTap
                    />
                </div>
            </div>
        </div>

    )
}

export default Signup;
