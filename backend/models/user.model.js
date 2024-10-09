import mongoose from "mongoose";
import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
        required:[true,'email is required'],
        unique:true,
    },
    name:{
        type:String,
        required:[true,'name is required'],
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    role:{
        type: String,
        enum: ['ADMIN', 'STUDENT', 'PROFESSOR'],
        default: null
    },
    avatar:{
        secure_url:String,
        public_id:String
    },
}, { timestamps: true });


userSchema.pre('save', async function(next){
    if(!this.isModified('password'))
    {
        return next();
    }
    else{
        this.password = await bcrypt.hash(this.password,10);
    }
})

userSchema.methods = {
    jwtToken(){
        return JWT.sign(
            {id:this._id,email:this.email},
            process.env.SECRET,
            {expiresIn:'24h'}
        )
    }
}

const User = mongoose.model('User', userSchema);
export default User;
