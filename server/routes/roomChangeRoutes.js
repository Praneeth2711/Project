const express = require('express');
const router = express.Router();
const {
  createRoomChangeRequest,
  getStudentRoomChanges,
  getOwnerRoomChanges,
  approveRoomChange,
  rejectRoomChange,
} = require('../controllers/roomChangeController');
const { verifyToken, isStudent, isOwner } = require('../middleware/auth');

router.post('/', verifyToken, isStudent, createRoomChangeRequest);
router.get('/student', verifyToken, isStudent, getStudentRoomChanges);

router.get('/owner', verifyToken, isOwner, getOwnerRoomChanges);
router.put('/:id/approve', verifyToken, isOwner, approveRoomChange);
router.put('/:id/reject', verifyToken, isOwner, rejectRoomChange);

module.exports = router;
