import mongoose from "mongoose";

const courseMap = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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

module.exports = mongoose.model('course', courseMap);
