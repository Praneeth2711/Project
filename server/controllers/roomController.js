const Room = require('../models/Room');
const Bed = require('../models/Bed');
const Hostel = require('../models/Hostel');

// @desc    Get all rooms for a hostel
// @route   GET /api/rooms/hostel/:hostelId
// @access  Public
const getRoomsByHostel = async (req, res, next) => {
  try {
    const { hostelId } = req.params;
    const rooms = await Room.find({ hostelId }).sort({ floor: 1, roomNumber: 1 }).lean();

    const enrichedRooms = await Promise.all(
      rooms.map(async (room) => {
        const beds = await Bed.find({ roomId: room._id })
          .populate('currentStudentId', 'name email phone')
          .lean();
        const availableBeds = beds.filter((b) => b.status === 'available').length;
        const pendingBeds = beds.filter((b) => b.status === 'pending').length;
        const occupiedBeds = beds.filter((b) => b.status === 'occupied').length;
        const maintenanceBeds = beds.filter((b) => b.status === 'maintenance').length;

        return {
          ...room,
          beds,
          totalBeds: beds.length,
          availableBeds,
          pendingBeds,
          occupiedBeds,
          maintenanceBeds,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedRooms.length,
      data: enrichedRooms,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single room with beds
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hostelId').lean();
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    const beds = await Bed.find({ roomId: room._id })
      .populate('currentStudentId', 'name email phone')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        ...room,
        beds,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new room & auto-generate beds (Owner only)
// @route   POST /api/rooms
// @access  Private (Owner)
const createRoom = async (req, res, next) => {
  try {
    const { hostelId, roomNumber, floor, roomType, capacity, monthlyRent } = req.body;

    if (!hostelId || !roomNumber || !roomType || !capacity || !monthlyRent) {
      return res.status(400).json({ success: false, message: 'Please provide all room fields.' });
    }

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found.' });
    }

    if (hostel.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this hostel.' });
    }

    // Check if room number already exists in this hostel
    const existing = await Room.findOne({ hostelId, roomNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Room ${roomNumber} already exists in this hostel.`,
      });
    }

    const room = await Room.create({
      hostelId,
      roomNumber,
      floor: Number(floor) || 1,
      roomType,
      capacity: Number(capacity),
      monthlyRent: Number(monthlyRent),
    });

    // Auto-create beds based on capacity
    const bedPromises = [];
    for (let i = 1; i <= Number(capacity); i++) {
      bedPromises.push(
        Bed.create({
          roomId: room._id,
          hostelId,
          bedNumber: `Bed ${i}`,
          status: 'available',
          price: Number(monthlyRent),
        })
      );
    }
    const createdBeds = await Promise.all(bedPromises);

    res.status(201).json({
      success: true,
      data: {
        ...room.toObject(),
        beds: createdBeds,
      },
      message: `Room ${roomNumber} created with ${createdBeds.length} beds.`,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update room details (Owner only)
// @route   PUT /api/rooms/:id
// @access  Private (Owner)
const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hostelId');
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    if (room.hostelId.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this room.' });
    }

    const { roomNumber, floor, roomType, monthlyRent } = req.body;
    if (roomNumber) room.roomNumber = roomNumber;
    if (floor !== undefined) room.floor = Number(floor);
    if (roomType) room.roomType = roomType;
    if (monthlyRent) {
      room.monthlyRent = Number(monthlyRent);
      // Update bed prices for available beds
      await Bed.updateMany(
        { roomId: room._id, status: 'available' },
        { price: Number(monthlyRent) }
      );
    }

    await room.save();

    res.status(200).json({
      success: true,
      data: room,
      message: 'Room updated successfully.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete room (Owner only)
// @route   DELETE /api/rooms/:id
// @access  Private (Owner)
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hostelId');
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    if (room.hostelId.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this room.' });
    }

    // Check if any bed is currently occupied or pending
    const activeBeds = await Bed.find({
      roomId: room._id,
      status: { $in: ['occupied', 'pending'] },
    });

    if (activeBeds.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with active or pending bed allocations. Please vacate beds first.',
      });
    }

    await Bed.deleteMany({ roomId: room._id });
    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Room and its beds deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRoomsByHostel,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
