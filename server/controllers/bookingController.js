const Booking = require('../models/Booking');
const Bed = require('../models/Bed');
const Room = require('../models/Room');
const Hostel = require('../models/Hostel');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create a new bed booking request (Student only)
// @route   POST /api/bookings
// @access  Private (Student)
const createBooking = async (req, res, next) => {
  try {
    const { hostelId, roomId, bedId, moveInDate, duration } = req.body;

    if (!hostelId || !roomId || !bedId || !moveInDate || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all booking details (hostel, room, bed, move-in date, duration).',
      });
    }

    // Validation 1: Prevent duplicate active allocations / requests
    const activeBooking = await Booking.findOne({
      studentId: req.user._id,
      status: { $in: ['pending', 'approved'] },
    });

    if (activeBooking) {
      return res.status(400).json({
        success: false,
        message:
          activeBooking.status === 'approved'
            ? 'You already have an active hostel bed allocation. Check "My Room".'
            : 'You already have a pending booking request awaiting owner approval.',
      });
    }

    // Validation 2: Ensure bed exists and is strictly AVAILABLE
    const bed = await Bed.findById(bedId);
    if (!bed) {
      return res.status(404).json({ success: false, message: 'Selected bed does not exist.' });
    }

    if (bed.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `Bed is no longer available. Current status: ${bed.status}.`,
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found.' });
    }

    // Create the booking with 'pending' status
    const booking = await Booking.create({
      studentId: req.user._id,
      hostelId,
      roomId,
      bedId,
      moveInDate: new Date(moveInDate),
      duration: Number(duration),
      monthlyRent: bed.price || room.monthlyRent,
      status: 'pending',
    });

    // Update bed status to PENDING
    bed.status = 'pending';
    bed.currentBookingId = booking._id;
    await bed.save();

    // Create notification for the hostel owner
    await Notification.create({
      userId: hostel.ownerId,
      message: `New booking request from ${req.user.name} for Room ${room.roomNumber} (${bed.bedNumber}).`,
      type: 'booking',
      link: '/owner/bookings',
    });

    // Populate for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('hostelId', 'name address city')
      .populate('roomId', 'roomNumber floor roomType')
      .populate('bedId', 'bedNumber price status');

    res.status(201).json({
      success: true,
      data: populatedBooking,
      message: 'Booking request submitted successfully! Awaiting owner approval.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all bookings for the logged-in student
// @route   GET /api/bookings/my
// @access  Private (Student)
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ studentId: req.user._id })
      .populate('hostelId', 'name address city images rating')
      .populate('roomId', 'roomNumber floor roomType')
      .populate('bedId', 'bedNumber price status')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all bookings for hostels owned by the logged-in owner
// @route   GET /api/bookings/owner
// @access  Private (Owner)
const getOwnerBookings = async (req, res, next) => {
  try {
    const myHostels = await Hostel.find({ ownerId: req.user._id }).select('_id');
    const hostelIds = myHostels.map((h) => h._id);

    const { status } = req.query;
    const filter = { hostelId: { $in: hostelIds } };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate({
        path: 'studentId',
        select: 'name email phone',
      })
      .populate('hostelId', 'name address city')
      .populate('roomId', 'roomNumber floor roomType')
      .populate('bedId', 'bedNumber price status')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve a booking request (Owner only)
// @route   PUT /api/bookings/:id/approve
// @access  Private (Owner)
const approveBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hostelId')
      .populate('roomId')
      .populate('bedId');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking request not found.' });
    }

    if (booking.hostelId.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to approve this booking.' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot approve request with status '${booking.status}'.`,
      });
    }

    const bed = await Bed.findById(booking.bedId._id);
    if (!bed) {
      return res.status(404).json({ success: false, message: 'Bed not found.' });
    }

    if (bed.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Bed is no longer in pending status (Current: ${bed.status}).`,
      });
    }

    // State transition:
    // booking.status = 'approved'
    // bed.status = 'occupied'
    booking.status = 'approved';
    await booking.save();

    bed.status = 'occupied';
    bed.currentStudentId = booking.studentId;
    bed.currentBookingId = booking._id;
    await bed.save();

    // Notify student
    await Notification.create({
      userId: booking.studentId,
      message: `Your booking request was approved! Room ${booking.roomId.roomNumber} • ${bed.bedNumber} at ${booking.hostelId.name}.`,
      type: 'approval',
      link: '/student/my-room',
    });

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking approved successfully! Bed is now marked as Occupied.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject a booking request (Owner only)
// @route   PUT /api/bookings/:id/reject
// @access  Private (Owner)
const rejectBooking = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate('hostelId')
      .populate('roomId')
      .populate('bedId');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking request not found.' });
    }

    if (booking.hostelId.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to reject this booking.' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject request with status '${booking.status}'.`,
      });
    }

    const reason = rejectionReason || 'Owner rejected the request.';

    // State transition:
    // booking.status = 'rejected'
    // bed.status = 'available'
    booking.status = 'rejected';
    booking.rejectionReason = reason;
    await booking.save();

    if (booking.bedId) {
      await Bed.findByIdAndUpdate(booking.bedId._id, {
        status: 'available',
        currentStudentId: null,
        currentBookingId: null,
      });
    }

    // Notify student
    await Notification.create({
      userId: booking.studentId,
      message: `Your booking request for Room ${booking.roomId?.roomNumber || ''} was rejected. Reason: ${reason}`,
      type: 'rejection',
      link: '/student/my-bookings',
    });

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking request rejected. Bed is now available for new bookings.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel a pending booking (Student only)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Student)
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking request not found.' });
    }

    if (booking.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking.' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending bookings can be cancelled.',
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Release bed back to available
    await Bed.findByIdAndUpdate(booking.bedId, {
      status: 'available',
      currentBookingId: null,
    });

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking request cancelled successfully.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get active allocated room for student (My Room)
// @route   GET /api/bookings/my-room
// @access  Private (Student)
const getMyRoom = async (req, res, next) => {
  try {
    const activeBooking = await Booking.findOne({
      studentId: req.user._id,
      status: 'approved',
    })
      .populate('hostelId')
      .populate('roomId')
      .populate('bedId')
      .lean();

    if (!activeBooking) {
      return res.status(200).json({
        success: true,
        hasRoom: false,
        message: 'No active room allocation found.',
      });
    }

    // Get roommates in the same room
    const roommatesBeds = await Bed.find({
      roomId: activeBooking.roomId._id,
      status: 'occupied',
    })
      .populate('currentStudentId', 'name email phone')
      .lean();

    const roommates = roommatesBeds
      .filter((b) => b.currentStudentId && b.currentStudentId._id.toString() !== req.user._id.toString())
      .map((b) => ({
        bedNumber: b.bedNumber,
        student: b.currentStudentId,
      }));

    res.status(200).json({
      success: true,
      hasRoom: true,
      data: {
        booking: activeBooking,
        roommates,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  approveBooking,
  rejectBooking,
  cancelBooking,
  getMyRoom,
};
