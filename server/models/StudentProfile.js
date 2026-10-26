const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    college: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    preferences: {
      maxBudget: { type: Number, default: 10000 },
      preferredHostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', default: null },
      preferredRoomType: { type: String, default: '2 Sharing' },
      preferredFloor: { type: Number, default: 1 },
      facilities: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
