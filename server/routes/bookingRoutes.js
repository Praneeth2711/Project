const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  approveBooking,
  rejectBooking,
  cancelBooking,
  getMyRoom,
} = require('../controllers/bookingController');
const { verifyToken, isStudent, isOwner } = require('../middleware/auth');

router.post('/', verifyToken, isStudent, createBooking);
router.get('/my', verifyToken, isStudent, getMyBookings);
router.get('/my-room', verifyToken, isStudent, getMyRoom);
router.put('/:id/cancel', verifyToken, isStudent, cancelBooking);

router.get('/owner', verifyToken, isOwner, getOwnerBookings);
router.put('/:id/approve', verifyToken, isOwner, approveBooking);
router.put('/:id/reject', verifyToken, isOwner, rejectBooking);

module.exports = router;
