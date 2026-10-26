const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Bed = require('../models/Bed');
const Booking = require('../models/Booking');

// @desc    Get comprehensive analytics and reports for owner
// @route   GET /api/reports/owner
// @access  Private (Owner)
const getOwnerReports = async (req, res, next) => {
  try {
    const hostels = await Hostel.find({ ownerId: req.user._id });
    const hostelIds = hostels.map((h) => h._id);

    const rooms = await Room.find({ hostelId: { $in: hostelIds } });
    const roomIds = rooms.map((r) => r._id);

    const beds = await Bed.find({ roomId: { $in: roomIds } });
    const totalBeds = beds.length;
    const occupiedBeds = beds.filter((b) => b.status === 'occupied').length;
    const availableBeds = beds.filter((b) => b.status === 'available').length;
    const pendingBeds = beds.filter((b) => b.status === 'pending').length;
    const maintenanceBeds = beds.filter((b) => b.status === 'maintenance').length;

    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    // Monthly estimated revenue from occupied beds
    const monthlyRevenue = beds
      .filter((b) => b.status === 'occupied')
      .reduce((acc, b) => acc + (b.price || 0), 0);

    // Pending booking requests count
    const pendingBookingsCount = await Booking.countDocuments({
      hostelId: { $in: hostelIds },
      status: 'pending',
    });

    // Room-wise occupancy (for BarChart)
    const roomOccupancy = rooms.map((room) => {
      const roomBeds = beds.filter((b) => b.roomId.toString() === room._id.toString());
      const occupied = roomBeds.filter((b) => b.status === 'occupied').length;
      const available = roomBeds.filter((b) => b.status === 'available').length;
      return {
        roomNumber: `Room ${room.roomNumber}`,
        floor: `Floor ${room.floor}`,
        total: roomBeds.length,
        occupied,
        available,
        rate: roomBeds.length > 0 ? Math.round((occupied / roomBeds.length) * 100) : 0,
      };
    });

    // Booking status distribution (for PieChart)
    const bookings = await Booking.find({ hostelId: { $in: hostelIds } });
    const bookingDistribution = [
      { name: 'Approved', value: bookings.filter((b) => b.status === 'approved').length, color: '#10b981' },
      { name: 'Pending', value: bookings.filter((b) => b.status === 'pending').length, color: '#f59e0b' },
      { name: 'Rejected', value: bookings.filter((b) => b.status === 'rejected').length, color: '#ef4444' },
      { name: 'Completed', value: bookings.filter((b) => b.status === 'completed').length, color: '#6366f1' },
    ].filter((item) => item.value > 0);

    // Bed status breakdown (for PieChart)
    const bedDistribution = [
      { name: 'Available', value: availableBeds, color: '#10b981' },
      { name: 'Occupied', value: occupiedBeds, color: '#ef4444' },
      { name: 'Pending', value: pendingBeds, color: '#f59e0b' },
      { name: 'Maintenance', value: maintenanceBeds, color: '#9ca3af' },
    ];

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalHostels: hostels.length,
          totalRooms: rooms.length,
          totalBeds,
          occupiedBeds,
          availableBeds,
          pendingBeds,
          maintenanceBeds,
          occupancyRate,
          monthlyRevenue,
          pendingBookingsCount,
        },
        roomOccupancy,
        bookingDistribution,
        bedDistribution,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOwnerReports,
};
