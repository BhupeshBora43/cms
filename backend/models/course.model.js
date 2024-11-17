import mongoose from "mongoose";

const course = new mongoose.Schema({
  courseName:{
    type:String,
    required:true,
    unique:true
  },
  courseCode:{
    type:String,
    required:true,
    unique:true
  },
  semester:{
    type:Number,
    required:true,
  },
  branch:{
    type:String,
    required:true,
  },
  video:{
    secure_url:{
        type:String
    },
    public_id:{
        type:String
    }
  },
  description:{
    type:String,
  },
  user_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
}, { timestamps: true });

export default mongoose.model('Course', course);
