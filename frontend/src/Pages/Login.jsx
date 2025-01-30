import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { googleSignup, userLogin, userSignup } from '../store/Slices/auth.slice';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [data, setData] = useState({
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

    const OnLogin = async (e) => {
        e.preventDefault();

        const { email, password } = data
        if (!email || !password) {
            return;
        }

        const res = await dispatch(userLogin(data))
        if (res.payload) {
            navigate('/')
        }
    }

    const handleGoogleLogIn = async (response) => {
        const { credential } = response;

        const res = await dispatch(googleSignup({ tokenId: credential }));
        if (res.payload) {
            navigate('/')
        }
        else toast.error('Something went wrong')
    }
    return (
        <div className='flex justify-center w-[100vw] items-center h-[80vh] bg-gray-100'>
            <div className='flex flex-col'>
                <form onSubmit={OnLogin} className='space-y-4 min-w-[30%] bg-white rounded-lg shadow-md p-8'>
                    <input required onChange={onUserInput} value={data?.email} placeholder='Email' className='border border-black outline-none w-full px-6 py-6 placeholder:px-4 block rounded-md' type="text" name='email' />

                    <input required onChange={onUserInput} value={data?.password} placeholder='Password' className='border border-black outline-none w-full px-6 py-6 placeholder:px-4 rounded-md' type="password" name='password' />

                    <button type='submit' className='bg-blue-700 hover:bg-blue-800 w-full py-3 transition-all duration-150'>Login</button>
                </form>

                <div className="mt-6 w-full max-w-md text-center ">
                    <div className="flex items-center space-x-2 justify-center mb-4">
                        <div className="w-1/3 border-t border-gray-300"></div>
                        <span className="text-gray-500 text-sm font-medium">or</span>
                        <div className="w-1/3 border-t border-gray-300"></div>
                    </div>

                    <GoogleLogin
                        onSuccess={handleGoogleLogIn}
                        onError={(error) => toast.error(error)}
                    />
                </div>
            </div>
        </div>
    )
}

export default Login
