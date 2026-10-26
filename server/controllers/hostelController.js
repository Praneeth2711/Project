const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Bed = require('../models/Bed');
const StudentProfile = require('../models/StudentProfile');

// @desc    Get all hostels with filters, search, and bed counts
// @route   GET /api/hostels
// @access  Public
const getHostels = async (req, res, next) => {
  try {
    const { search, city, gender, minRent, maxRent, facilities, sort } = req.query;

    const query = { status: 'active' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    if (city && city !== 'All') {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    if (gender && gender !== 'All') {
      query.gender = gender;
    }

    if (minRent || maxRent) {
      query.monthlyRent = {};
      if (minRent) query.monthlyRent.$gte = Number(minRent);
      if (maxRent) query.monthlyRent.$lte = Number(maxRent);
    }

    if (facilities) {
      const facArray = facilities.split(',').map((f) => f.trim());
      query.facilities = { $all: facArray };
    }

    let sortOptions = { rating: -1 };
    if (sort === 'price_asc') sortOptions = { monthlyRent: 1 };
    if (sort === 'price_desc') sortOptions = { monthlyRent: -1 };
    if (sort === 'rating_desc') sortOptions = { rating: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    const hostels = await Hostel.find(query).sort(sortOptions).lean();

    // Enrich each hostel with real bed counts & room counts
    const enrichedHostels = await Promise.all(
      hostels.map(async (hostel) => {
        const rooms = await Room.find({ hostelId: hostel._id });
        const roomIds = rooms.map((r) => r._id);
        const totalBeds = await Bed.countDocuments({ roomId: { $in: roomIds } });
        const availableBeds = await Bed.countDocuments({
          roomId: { $in: roomIds },
          status: 'available',
        });
        const occupiedBeds = await Bed.countDocuments({
          roomId: { $in: roomIds },
          status: 'occupied',
        });

        return {
          ...hostel,
          totalRooms: rooms.length,
          totalBeds,
          availableBeds,
          occupiedBeds,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedHostels.length,
      data: enrichedHostels,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single hostel with its rooms and bed statistics
// @route   GET /api/hostels/:id
// @access  Public
const getHostelById = async (req, res, next) => {
  try {
    const hostel = await Hostel.findById(req.params.id).populate('ownerId', 'name email phone').lean();
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found.' });
    }

    const rooms = await Room.find({ hostelId: hostel._id }).sort({ floor: 1, roomNumber: 1 }).lean();

    const enrichedRooms = await Promise.all(
      rooms.map(async (room) => {
        const beds = await Bed.find({ roomId: room._id }).lean();
        const availableCount = beds.filter((b) => b.status === 'available').length;
        const pendingCount = beds.filter((b) => b.status === 'pending').length;
        const occupiedCount = beds.filter((b) => b.status === 'occupied').length;

        let statusText = 'Available';
        if (availableCount === 0 && (occupiedCount > 0 || pendingCount > 0)) {
          statusText = 'Full';
        } else if (availableCount < beds.length) {
          statusText = 'Partially Occupied';
        }

        return {
          ...room,
          beds,
          totalBeds: beds.length,
          availableBeds: availableCount,
          pendingBeds: pendingCount,
          occupiedBeds: occupiedCount,
          statusText,
        };
      })
    );

    const totalBeds = enrichedRooms.reduce((acc, r) => acc + r.totalBeds, 0);
    const availableBeds = enrichedRooms.reduce((acc, r) => acc + r.availableBeds, 0);

    res.status(200).json({
      success: true,
      data: {
        ...hostel,
        totalBeds,
        availableBeds,
        rooms: enrichedRooms,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new hostel (Owner only)
// @route   POST /api/hostels
// @access  Private (Owner)
const createHostel = async (req, res, next) => {
  try {
    const { name, description, address, city, gender, monthlyRent, facilities, images } = req.body;

    const hostel = await Hostel.create({
      ownerId: req.user._id,
      name,
      description,
      address,
      city,
      gender: gender || 'Co-ed',
      monthlyRent,
      facilities: facilities || [],
      images: images && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80'
      ],
      rating: 4.8,
    });

    res.status(201).json({
      success: true,
      data: hostel,
      message: 'Hostel created successfully!',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update hostel details (Owner only)
// @route   PUT /api/hostels/:id
// @access  Private (Owner)
const updateHostel = async (req, res, next) => {
  try {
    let hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found.' });
    }

    if (hostel.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this hostel.' });
    }

    hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: hostel,
      message: 'Hostel details updated successfully!',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete hostel (Owner only)
// @route   DELETE /api/hostels/:id
// @access  Private (Owner)
const deleteHostel = async (req, res, next) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found.' });
    }

    if (hostel.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this hostel.' });
    }

    const rooms = await Room.find({ hostelId: hostel._id });
    const roomIds = rooms.map((r) => r._id);
    await Bed.deleteMany({ roomId: { $in: roomIds } });
    await Room.deleteMany({ hostelId: hostel._id });
    await hostel.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Hostel and associated rooms/beds deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get owner's hostels
// @route   GET /api/hostels/owner/my
// @access  Private (Owner)
const getMyHostels = async (req, res, next) => {
  try {
    const hostels = await Hostel.find({ ownerId: req.user._id }).lean();
    
    const enriched = await Promise.all(
      hostels.map(async (hostel) => {
        const rooms = await Room.find({ hostelId: hostel._id });
        const roomIds = rooms.map((r) => r._id);
        const totalBeds = await Bed.countDocuments({ roomId: { $in: roomIds } });
        const availableBeds = await Bed.countDocuments({ roomId: { $in: roomIds }, status: 'available' });
        const occupiedBeds = await Bed.countDocuments({ roomId: { $in: roomIds }, status: 'occupied' });
        const pendingBeds = await Bed.countDocuments({ roomId: { $in: roomIds }, status: 'pending' });

        return {
          ...hostel,
          totalRooms: rooms.length,
          totalBeds,
          availableBeds,
          occupiedBeds,
          pendingBeds,
        };
      })
    );

    res.status(200).json({ success: true, data: enriched });
  } catch (err) {
    next(err);
  }
};

// @desc    Smart Bed Recommendation Engine (Rule-Based Scoring System)
// @route   POST /api/hostels/recommendations
// @access  Public / Private (Student)
const getSmartRecommendations = async (req, res, next) => {
  try {
    let {
      maxBudget,
      preferredHostelId,
      preferredRoomType,
      preferredFloor,
      facilities = [],
    } = req.body;

    // If student is logged in and no body preferences passed, grab from student profile
    if (req.user && req.user.role === 'student' && (!maxBudget || !preferredRoomType)) {
      const profile = await StudentProfile.findOne({ userId: req.user._id });
      if (profile && profile.preferences) {
        maxBudget = maxBudget || profile.preferences.maxBudget;
        preferredHostelId = preferredHostelId || profile.preferences.preferredHostelId;
        preferredRoomType = preferredRoomType || profile.preferences.preferredRoomType;
        preferredFloor = preferredFloor || profile.preferences.preferredFloor;
        if (!facilities.length && profile.preferences.facilities) {
          facilities = profile.preferences.facilities;
        }
      }
    }

    const budget = Number(maxBudget) || 10000;
    const prefFloor = preferredFloor !== undefined && preferredFloor !== '' ? Number(preferredFloor) : null;

    // Find all currently AVAILABLE beds
    const availableBeds = await Bed.find({ status: 'available' })
      .populate('roomId')
      .populate('hostelId')
      .lean();

    // Filter beds whose hostel is active and room exists
    const validBeds = availableBeds.filter(
      (b) => b.roomId && b.hostelId && b.hostelId.status === 'active'
    );

    // Score each bed (0 to 100 points)
    // Budget match:             30 points
    // Hostel preference:        25 points
    // Room type preference:     20 points
    // Floor preference:         10 points
    // Facilities match:         15 points
    const scoredBeds = validBeds.map((bed) => {
      let score = 0;
      const reasons = [];

      // 1. Budget match (30 pts)
      const bedPrice = bed.price || bed.roomId.monthlyRent || bed.hostelId.monthlyRent;
      if (bedPrice <= budget) {
        score += 30;
        reasons.push('✓ Within budget');
      } else {
        const diff = bedPrice - budget;
        if (diff <= 1000) {
          score += 15;
          reasons.push('Almost in budget (+$1k)');
        }
      }

      // 2. Preferred Hostel match (25 pts)
      if (preferredHostelId && bed.hostelId._id.toString() === preferredHostelId.toString()) {
        score += 25;
        reasons.push('✓ Preferred hostel');
      } else if (!preferredHostelId) {
        // Neutral bonus if no preference
        score += 15;
      }

      // 3. Room type match (20 pts)
      if (preferredRoomType && bed.roomId.roomType === preferredRoomType) {
        score += 20;
        reasons.push(`✓ Preferred ${preferredRoomType}`);
      } else if (!preferredRoomType) {
        score += 10;
      }

      // 4. Floor preference (10 pts)
      if (prefFloor !== null && bed.roomId.floor === prefFloor) {
        score += 10;
        reasons.push(`✓ Floor ${prefFloor} match`);
      } else if (prefFloor === null) {
        score += 5;
      }

      // 5. Facilities match (15 pts)
      const hostelFacilities = bed.hostelId.facilities || [];
      if (facilities.length > 0) {
        const matchedFacs = facilities.filter((f) => hostelFacilities.includes(f));
        const facRatio = matchedFacs.length / facilities.length;
        const facScore = Math.round(facRatio * 15);
        score += facScore;
        if (matchedFacs.length > 0) {
          reasons.push(`✓ ${matchedFacs.length}/${facilities.length} Facilities matched`);
        }
      } else {
        score += 10;
      }

      return {
        bedId: bed._id,
        bedNumber: bed.bedNumber,
        price: bedPrice,
        status: bed.status,
        room: {
          _id: bed.roomId._id,
          roomNumber: bed.roomId.roomNumber,
          floor: bed.roomId.floor,
          roomType: bed.roomId.roomType,
          capacity: bed.roomId.capacity,
        },
        hostel: {
          _id: bed.hostelId._id,
          name: bed.hostelId.name,
          city: bed.hostelId.city,
          address: bed.hostelId.address,
          rating: bed.hostelId.rating,
          images: bed.hostelId.images,
          facilities: bed.hostelId.facilities,
        },
        matchPercentage: Math.min(100, Math.max(10, score)),
        reasons,
      };
    });

    // Sort descending by matchPercentage
    scoredBeds.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({
      success: true,
      count: scoredBeds.length,
      data: scoredBeds.slice(0, 8), // Return top 8 best recommendations
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHostels,
  getHostelById,
  createHostel,
  updateHostel,
  deleteHostel,
  getMyHostels,
  getSmartRecommendations,
};
