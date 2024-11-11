import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { userSignup } from '../store/Slices/auth.slice';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [data ,setData] = useState({
        name:"",
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

    const OnSignup = async(e)=>{

        e.preventDefault();

        const {email, password, name} = data
        if(!email || !password || !name){
            return;
        }
        const res = await dispatch(userSignup(data))

        if(res?.payload){
            navigate("/login");
        }
    }

  return (
    <div className='flex justify-center w-[100vw] items-center h-[80vh]'>
        <form onSubmit={OnSignup}  className='space-y-4 w-[30%] '>
            <input required onChange={onUserInput} value={data?.name} placeholder='Name' className='border border-black outline-none w-full px-6 py-6 placeholder:px-4 ' type="text" name='name' />

            <input required onChange={onUserInput} value={data?.email} placeholder='Email' className='border border-black outline-none w-full px-6 py-6 placeholder:px-4 block' type="text" name='email' />

            <input required onChange={onUserInput} value={data?.password} placeholder='Password' className='border border-black outline-none w-full px-6 py-6 placeholder:px-4 ' type="password" name='password' />

            <button type='submit' className='bg-blue-700 hover:bg-blue-800 w-full py-3 transition-all duration-150'>Signup</button>
        </form>
    </div>
  )
}

export default Signup;
