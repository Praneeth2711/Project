const RoomChangeRequest = require('../models/RoomChangeRequest');
const Booking = require('../models/Booking');
const Bed = require('../models/Bed');
const Room = require('../models/Room');
const Hostel = require('../models/Hostel');
const Notification = require('../models/Notification');

// @desc    Submit a room change request (Student only)
// @route   POST /api/room-changes
// @access  Private (Student)
const createRoomChangeRequest = async (req, res, next) => {
  try {
    const { requestedRoomId, requestedBedId, reason, additionalMessage } = req.body;

    if (!requestedRoomId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide requested room and reason for room change.',
      });
    }

    // Check student's current active booking
    const activeBooking = await Booking.findOne({
      studentId: req.user._id,
      status: 'approved',
    });

    if (!activeBooking) {
      return res.status(400).json({
        success: false,
        message: 'You do not have an active room allocation to change.',
      });
    }

    // Check if a pending room change request already exists
    const existingPending = await RoomChangeRequest.findOne({
      studentId: req.user._id,
      status: 'pending',
    });

    if (existingPending) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending room change request under review.',
      });
    }

    const roomChange = await RoomChangeRequest.create({
      studentId: req.user._id,
      hostelId: activeBooking.hostelId,
      currentRoomId: activeBooking.roomId,
      currentBedId: activeBooking.bedId,
      requestedRoomId,
      requestedBedId: requestedBedId || null,
      reason,
      additionalMessage: additionalMessage || '',
      status: 'pending',
    });

    // Notify hostel owner
    const hostel = await Hostel.findById(activeBooking.hostelId);
    if (hostel) {
      await Notification.create({
        userId: hostel.ownerId,
        message: `New room change request from ${req.user.name}.`,
        type: 'room_change',
        link: '/owner/room-changes',
      });
    }

    res.status(201).json({
      success: true,
      data: roomChange,
      message: 'Room change request submitted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get room change requests for student
// @route   GET /api/room-changes/student
// @access  Private (Student)
const getStudentRoomChanges = async (req, res, next) => {
  try {
    const requests = await RoomChangeRequest.find({ studentId: req.user._id })
      .populate('currentRoomId', 'roomNumber floor roomType')
      .populate('currentBedId', 'bedNumber')
      .populate('requestedRoomId', 'roomNumber floor roomType')
      .populate('requestedBedId', 'bedNumber')
      .populate('hostelId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get room change requests for owner's hostels
// @route   GET /api/room-changes/owner
// @access  Private (Owner)
const getOwnerRoomChanges = async (req, res, next) => {
  try {
    const myHostels = await Hostel.find({ ownerId: req.user._id }).select('_id');
    const hostelIds = myHostels.map((h) => h._id);

    const requests = await RoomChangeRequest.find({ hostelId: { $in: hostelIds } })
      .populate('studentId', 'name email phone')
      .populate('currentRoomId', 'roomNumber floor roomType')
      .populate('currentBedId', 'bedNumber')
      .populate('requestedRoomId', 'roomNumber floor roomType')
      .populate('requestedBedId', 'bedNumber')
      .populate('hostelId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve room change request (Owner only)
// @route   PUT /api/room-changes/:id/approve
// @access  Private (Owner)
const approveRoomChange = async (req, res, next) => {
  try {
    const request = await RoomChangeRequest.findById(req.params.id)
      .populate('hostelId')
      .populate('requestedRoomId')
      .populate('currentRoomId')
      .populate('currentBedId');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Room change request not found.' });
    }

    if (request.hostelId.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this hostel.' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot approve request with status '${request.status}'.`,
      });
    }

    // Find a target bed in requestedRoom
    let targetBed = null;
    if (request.requestedBedId) {
      targetBed = await Bed.findById(request.requestedBedId);
      if (!targetBed || targetBed.status !== 'available') {
        targetBed = null; // Fallback to finding any available bed in that room
      }
    }

    if (!targetBed) {
      targetBed = await Bed.findOne({
        roomId: request.requestedRoomId._id,
        status: 'available',
      });
    }

    if (!targetBed) {
      return res.status(400).json({
        success: false,
        message: 'No available bed in the requested room to complete the change.',
      });
    }

    // 1. Release OLD Bed -> available
    await Bed.findByIdAndUpdate(request.currentBedId._id, {
      status: 'available',
      currentStudentId: null,
      currentBookingId: null,
    });

    // 2. Allocate NEW Bed -> occupied
    targetBed.status = 'occupied';
    targetBed.currentStudentId = request.studentId;
    await targetBed.save();

    // 3. Update Student's active booking
    const activeBooking = await Booking.findOne({
      studentId: request.studentId,
      status: 'approved',
    });

    if (activeBooking) {
      activeBooking.roomId = request.requestedRoomId._id;
      activeBooking.bedId = targetBed._id;
      await activeBooking.save();

      targetBed.currentBookingId = activeBooking._id;
      await targetBed.save();
    }

    // 4. Mark request approved
    request.status = 'approved';
    request.requestedBedId = targetBed._id;
    await request.save();

    // 5. Notify student
    await Notification.create({
      userId: request.studentId,
      message: `Your room change request was approved! You are now allocated to Room ${request.requestedRoomId.roomNumber} (${targetBed.bedNumber}).`,
      type: 'room_change',
      link: '/student/my-room',
    });

    res.status(200).json({
      success: true,
      message: 'Room change approved and beds successfully reallocated!',
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject room change request (Owner only)
// @route   PUT /api/room-changes/:id/reject
// @access  Private (Owner)
const rejectRoomChange = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const request = await RoomChangeRequest.findById(req.params.id).populate('hostelId');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Room change request not found.' });
    }

    if (request.hostelId.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this hostel.' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject request with status '${request.status}'.`,
      });
    }

    request.status = 'rejected';
    request.rejectionReason = rejectionReason || 'Room change request could not be accommodated.';
    await request.save();

    // Notify student
    await Notification.create({
      userId: request.studentId,
      message: `Your room change request was rejected. Reason: ${request.rejectionReason}`,
      type: 'room_change',
      link: '/student/my-room',
    });

    res.status(200).json({
      success: true,
      message: 'Room change request rejected.',
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRoomChangeRequest,
  getStudentRoomChanges,
  getOwnerRoomChanges,
  approveRoomChange,
  rejectRoomChange,
};
