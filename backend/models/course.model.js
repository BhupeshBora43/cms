import mongoose from "mongoose";

const courseMap = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  code:{
    type:String,
    required:true,
    unique:true
  },
  semester:{
    type:Number,
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

module.exports = mongoose.model('courseMap', courseMap);
