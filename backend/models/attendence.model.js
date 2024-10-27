import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  course_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Course',
    required:true
  },

  students:[{
    student_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    flag:{
        type:Boolean,
        required:true,
        default:true
    }
  }],
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);
