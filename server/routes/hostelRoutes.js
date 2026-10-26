const express = require('express');
const router = express.Router();
const {
  getHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel,
  getMyHostels,
  getSmartRecommendations,
} = require('../controllers/hostelController');
const { verifyToken, isOwner } = require('../middleware/auth');

router.get('/', getHostels);
router.post('/recommendations', getSmartRecommendations);
router.get('/owner/my', verifyToken, isOwner, getMyHostels);
router.get('/:id', getHostelById);

router.post('/', verifyToken, isOwner, createHostel);
router.put('/:id', verifyToken, isOwner, updateHostel);
router.delete('/:id', verifyToken, isOwner, deleteHostel);

module.exports = router;
