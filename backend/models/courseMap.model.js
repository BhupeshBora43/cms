import mongoose from "mongoose";

const courseMap = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true,"user_id is required"]
  },
  course_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required:[true, "course_id is required"]
  },
  semester: {
    type: String,
    required: true,
  },
  approved:{
    type:Boolean,
    default:false
  }
}, { timestamps: true });

export default mongoose.model('courseMap', courseMap);
