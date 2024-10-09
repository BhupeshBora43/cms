import express from 'express';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary'
import fs from 'fs/promises'
import User from '../models/user.model.js'

const register = async(req,res) =>{
    const {name,email,password} = req.body;
    if(!(name && email && password))
    {
        return res.status(500).json({
            success:false,
            message:"All fields are required"
        });
    }

    try{
        const user = await User.create({
            name,
            email,
            password
        });
        console.log("here ");
        return res.status(200).json({
            success:true,
            message:"user created successfully"
        });
    }catch(err){
        console.log(err);
        return res.status(400).json({
            success:false,
            message:"registration unsuccessful"
        });
    }
}

const login = async(req,res)=>{
    const {email,password} = req.body;
    if(!(email && password))
    {
        return res.status(500).json({
            success:false,
            message:"all credential are required"
        })
    }

    try{
        const user = await User.findOne({email}).select('+password')
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!user || !isPasswordValid){
            return res.status(400).json({
                success:false,
                message:"please enter valid credential"
            })
        }
        user.password = undefined;
        const token = user.jwtToken();
        const cookieOptions = {
            maxAge: 3600000,
            httpOnly:true,
        }

        res.cookie('token',token,cookieOptions);

        res.status(200).json({
            success:true,
            data:user,
            message:'user logged in successfully',
        })
    }catch(err){
        return res.status(400).json({
            success:false,
            message:err.message
        })
    }
}

const about = async function(req,res){
    try{
        const userId = req.user.id;
        const user = await User.findById(userId)
        res.status(200).json({
            success:true,
            user
        })
    } catch(err){
        return res.status(500).json({
            success:false,
            message:"Enter valid credential",
        })
    }
}

const editUserDetails = async function (req, res){
    const email = req.user.email;
    const user = await User.findOne({email});
    const { name } = req.body;
    console.log("name = ",name);
    if(name){
        try{
            user.name = name;
            user.save();
        }catch(err){
            res.status(400).json({
                success:false,
                message:"failed to change the name"
            })
        }
    }
    if(req.file){
        try{
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'profile_pictures',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            })
            if(result)
            {
                console.log("Full result = ", JSON.stringify(result, null, 2));
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;
                console.log("secure url = ",user.avatar.secure_url);

                console.log("removing file");
                await user.save();
                fs.rm(`../uploads/${req.file.filename}`);
            }
        }catch(e){
            res.status(400).json({
                success:false,
                message:"please reupload the image"
            })
        }
    }
    res.status(200).json({
        success:true,
        message:"User details updated successfully",
        user
    })
}

const updatePassword = async function(req,res){
    console.log("reached update");
    const {password} = req.body;
    if(!password){
        res.status(400).json({
            message:"Enter new password"
        })
    }
    const email = req.user.email;
    const user = await User.findOne({email});
    user.password = password;
    await user.save();
    res.status(200).json({
        user
    })
}


export{
    register,
    login,
    about,
    editUserDetails,
    updatePassword,
}