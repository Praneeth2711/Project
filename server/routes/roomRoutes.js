const express = require('express');
const router = express.Router();
const {
  getRoomsByHostel,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { verifyToken, isOwner } = require('../middleware/auth');

router.get('/hostel/:hostelId', getRoomsByHostel);
router.get('/:id', getRoomById);

router.post('/', verifyToken, isOwner, createRoom);
router.put('/:id', verifyToken, isOwner, updateRoom);
router.delete('/:id', verifyToken, isOwner, deleteRoom);

module.exports = router;
