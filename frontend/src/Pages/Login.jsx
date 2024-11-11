import { useState } from 'react'
import { useDispatch } from 'react-redux';
import {userLogin } from '../store/Slices/auth.slice';
import Layout from '../Layouts/Layout';
import { useNavigate } from 'react-router-dom';

function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, isLoading] = useState(false)
    const [error, setError] = useState(null)

    const [data ,setData] = useState({
        email:"",
        password:""
    })

    const onUserInput = (e) =>{
        const {value , name} = e.target;

        setData({
            ...data,
            [name]  :value
        })
    }

    const OnLogin = async(e)=>{
        e.preventDefault();

        const {email, password} = data
        if(!email || !password){
            return;
        }

        const res = await dispatch(userLogin(data))
        if(res.payload){
            navigate('/')
        }
    }

  return (
        <div className='flex justify-center w-[100vw] items-center h-full '>
        <form onSubmit={OnLogin}  className='space-y-4 w-[30%] '>
            <input required onChange={onUserInput} value={data?.email} placeholder='Email' className='border border-black outline-none w-full px-6 py-6 placeholder:px-4 block' type="text" name='email' />

            <input required onChange={onUserInput} value={data?.password} placeholder='Password' className='border border-black outline-none w-full px-6 py-6 placeholder:px-4 ' type="password" name='password' />

            <button type='submit' className='bg-blue-700 hover:bg-blue-800 w-full py-3 transition-all duration-150'>Login</button>
        </form>
    </div>
  )
}

export default Login
