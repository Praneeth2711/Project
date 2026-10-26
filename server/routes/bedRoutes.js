const express = require('express');
const router = express.Router();
const {
  getBedsByRoom,
  getBedById,
  updateBedStatus,
  vacateBed,
  getHostelBedMatrix,
} = require('../controllers/bedController');
const { verifyToken, isOwner } = require('../middleware/auth');

router.get('/room/:roomId', getBedsByRoom);
router.get('/hostel/:hostelId/matrix', verifyToken, isOwner, getHostelBedMatrix);
router.get('/:id', verifyToken, getBedById);

router.put('/:id/status', verifyToken, isOwner, updateBedStatus);
router.put('/:id/vacate', verifyToken, isOwner, vacateBed);

module.exports = router;
