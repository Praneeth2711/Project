const Bed = require('../models/Bed');
const Room = require('../models/Room');
const Hostel = require('../models/Hostel');
const Booking = require('../models/Booking');
const StudentProfile = require('../models/StudentProfile');
const Notification = require('../models/Notification');

// @desc    Get beds for a room
// @route   GET /api/beds/room/:roomId
// @access  Public
const getBedsByRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const beds = await Bed.find({ roomId })
      .populate('currentStudentId', 'name email phone')
      .lean();

    res.status(200).json({
      success: true,
      count: beds.length,
      data: beds,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single bed details (with occupant info if occupied)
// @route   GET /api/beds/:id
// @access  Private
const getBedById = async (req, res, next) => {
  try {
    const bed = await Bed.findById(req.params.id)
      .populate('roomId')
      .populate('hostelId')
      .populate('currentStudentId', 'name email phone')
      .populate('currentBookingId')
      .lean();

    if (!bed) {
      return res.status(404).json({ success: false, message: 'Bed not found.' });
    }

    let studentProfile = null;
    if (bed.currentStudentId) {
      studentProfile = await StudentProfile.findOne({ userId: bed.currentStudentId._id }).lean();
    }

    res.status(200).json({
      success: true,
      data: {
        ...bed,
        studentProfile,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update bed status (Owner only: available <-> maintenance)
// @route   PUT /api/beds/:id/status
// @access  Private (Owner)
const updateBedStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const bed = await Bed.findById(req.params.id).populate('hostelId');
    if (!bed) {
      return res.status(404).json({ success: false, message: 'Bed not found.' });
    }

    if (bed.hostelId.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this hostel.' });
    }

    if (bed.status === 'occupied') {
      return res.status(400).json({
        success: false,
        message: 'Cannot manually change status of an occupied bed. Use "Vacate Bed" instead.',
      });
    }

    if (!['available', 'maintenance'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Manual status update only allowed for "available" or "maintenance".',
      });
    }

    bed.status = status;
    await bed.save();

    res.status(200).json({
      success: true,
      data: bed,
      message: `Bed status updated to ${status}.`,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Vacate an occupied bed (Owner only)
// @route   PUT /api/beds/:id/vacate
// @access  Private (Owner)
const vacateBed = async (req, res, next) => {
  try {
    const bed = await Bed.findById(req.params.id).populate('hostelId');
    if (!bed) {
      return res.status(404).json({ success: false, message: 'Bed not found.' });
    }

    if (bed.hostelId.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this hostel.' });
    }

    if (bed.status !== 'occupied') {
      return res.status(400).json({
        success: false,
        message: 'Bed is not currently occupied.',
      });
    }

    const previousStudentId = bed.currentStudentId;
    const previousBookingId = bed.currentBookingId;

    // Update bed
    bed.status = 'available';
    bed.currentStudentId = null;
    bed.currentBookingId = null;
    await bed.save();

    // Update active booking
    if (previousBookingId) {
      await Booking.findByIdAndUpdate(previousBookingId, { status: 'completed' });
    } else if (previousStudentId) {
      await Booking.updateMany(
        { studentId: previousStudentId, bedId: bed._id, status: 'approved' },
        { status: 'completed' }
      );
    }

    // Send notification to student
    if (previousStudentId) {
      await Notification.create({
        userId: previousStudentId,
        message: `Your stay at ${bed.hostelId.name} has been marked completed and the bed vacated. Thank you!`,
        type: 'vacate',
        link: '/student/my-room',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bed vacated successfully and is now available for new bookings.',
      data: bed,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get complete hostel bed visual matrix (grouped by floors & rooms)
// @route   GET /api/beds/hostel/:hostelId/matrix
// @access  Private (Owner)
const getHostelBedMatrix = async (req, res, next) => {
  try {
    const { hostelId } = req.params;
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found.' });
    }

    if (hostel.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this hostel.' });
    }

    const rooms = await Room.find({ hostelId }).sort({ floor: 1, roomNumber: 1 }).lean();

    const floorMap = {};

    for (const room of rooms) {
      const beds = await Bed.find({ roomId: room._id })
        .populate('currentStudentId', 'name email phone')
        .lean();

      if (!floorMap[room.floor]) {
        floorMap[room.floor] = {
          floorNumber: room.floor,
          rooms: [],
        };
      }

      floorMap[room.floor].rooms.push({
        ...room,
        beds,
        totalBeds: beds.length,
        availableBeds: beds.filter((b) => b.status === 'available').length,
        pendingBeds: beds.filter((b) => b.status === 'pending').length,
        occupiedBeds: beds.filter((b) => b.status === 'occupied').length,
        maintenanceBeds: beds.filter((b) => b.status === 'maintenance').length,
      });
    }

    const floors = Object.values(floorMap).sort((a, b) => a.floorNumber - b.floorNumber);

    res.status(200).json({
      success: true,
      data: {
        hostelName: hostel.name,
        floors,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBedsByRoom,
  getBedById,
  updateBedStatus,
  vacateBed,
  getHostelBedMatrix,
};
