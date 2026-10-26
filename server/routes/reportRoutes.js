const express = require('express');
const router = express.Router();
const { getOwnerReports } = require('../controllers/reportController');
const { verifyToken, isOwner } = require('../middleware/auth');

router.get('/owner', verifyToken, isOwner, getOwnerReports);

module.exports = router;
