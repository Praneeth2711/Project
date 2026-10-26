const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide hostel name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Please provide hostel address'],
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Boys', 'Girls', 'Co-ed'],
      default: 'Co-ed',
    },
    monthlyRent: {
      type: Number,
      required: [true, 'Please provide starting monthly rent'],
    },
    facilities: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      default: 4.5,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Hostel', hostelSchema);
