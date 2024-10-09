import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  semester: {
    type: number,
    required: true,
  },
  total_attendance: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
