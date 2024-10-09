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
        ref:'Student',
        required:true
    },
    flag:{
        type:Boolean,
        required:true
    }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
