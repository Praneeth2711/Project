const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const OwnerProfile = require('../models/OwnerProfile');
const Hostel = require('../models/Hostel');
const { generateToken } = require('../utils/jwt');

// @desc    Register a new student
// @route   POST /api/auth/student/register
// @access  Public
const registerStudent = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      college,
      department,
      year,
      gender,
      password,
      confirmPassword,
    } = req.body;

    if (!name || !email || !phone || !college || !department || !year || !gender || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'student',
    });

    const studentProfile = await StudentProfile.create({
      userId: user._id,
      college,
      department,
      year,
      gender,
      preferences: {
        maxBudget: 12000,
        preferredRoomType: '2 Sharing',
        preferredFloor: 1,
        facilities: ['Wi-Fi', 'Mess Food'],
      },
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: studentProfile,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login student
// @route   POST /api/auth/student/login
// @access  Public
const loginStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || user.role !== 'student') {
      return res.status(401).json({ success: false, message: 'Invalid student credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid student credentials.' });
    }

    const profile = await StudentProfile.findOne({ userId: user._id });
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Register a new hostel owner
// @route   POST /api/auth/owner/register
// @access  Public
const registerOwner = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      hostelName,
      hostelAddress,
      city,
    } = req.body;

    if (!name || !email || !phone || !password || !hostelName || !hostelAddress || !city) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'owner',
    });

    const ownerProfile = await OwnerProfile.create({
      userId: user._id,
      phone,
      hostelName,
      hostelAddress,
      city,
    });

    // Automatically create the initial Hostel record for this owner!
    await Hostel.create({
      ownerId: user._id,
      name: hostelName,
      description: `Welcome to ${hostelName}, providing premium accommodation and comfortable student living.`,
      address: hostelAddress,
      city,
      gender: 'Co-ed',
      monthlyRent: 6000,
      facilities: ['Wi-Fi', 'Mess Food', 'CCTV Security', 'Power Backup'],
      images: [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
      ],
      rating: 4.8,
      status: 'active',
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: ownerProfile,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login owner
// @route   POST /api/auth/owner/login
// @access  Public
const loginOwner = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || user.role !== 'owner') {
      return res.status(401).json({ success: false, message: 'Invalid owner credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid owner credentials.' });
    }

    const profile = await OwnerProfile.findOne({ userId: user._id });
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user & profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;
    let hostel = null;

    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ userId: user._id });
    } else if (user.role === 'owner') {
      profile = await OwnerProfile.findOne({ userId: user._id });
      hostel = await Hostel.findOne({ ownerId: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile,
        hostel,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mock / Simulate Forgot Password for Demo
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide registered email.' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(404).json({ success: false, message: 'No account found with this email.' });
  }

  if (newPassword) {
    user.password = newPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'Password successfully updated! You can now log in with your new password.',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Reset instructions sent. For demonstration, you can enter a new password directly.',
    canReset: true,
  });
};

module.exports = {
  registerStudent,
  loginStudent,
  registerOwner,
  loginOwner,
  getMe,
  forgotPassword,
};
