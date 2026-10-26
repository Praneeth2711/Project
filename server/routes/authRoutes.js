const express = require('express');
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  registerOwner,
  loginOwner,
  getMe,
  forgotPassword,
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/student/register', registerStudent);
router.post('/student/login', loginStudent);

router.post('/owner/register', registerOwner);
router.post('/owner/login', loginOwner);

router.get('/me', verifyToken, getMe);
router.post('/forgot-password', forgotPassword);

module.exports = router;
