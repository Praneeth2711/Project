const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true,
    },
    roomNumber: {
      type: String,
      required: [true, 'Please provide room number (e.g., 101)'],
      trim: true,
    },
    floor: {
      type: Number,
      required: true,
      default: 1,
    },
    roomType: {
      type: String,
      enum: ['Single', '2 Sharing', '3 Sharing', '4 Sharing'],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    monthlyRent: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);
