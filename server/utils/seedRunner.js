const mongoose = require('mongoose');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const OwnerProfile = require('../models/OwnerProfile');
const Hostel = require('../models/Hostel');
const Room = require('../models/Room');
const Bed = require('../models/Bed');
const Booking = require('../models/Booking');
const RoomChangeRequest = require('../models/RoomChangeRequest');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    console.log('🧹 Clearing previous collections...');
    await Promise.all([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      OwnerProfile.deleteMany({}),
      Hostel.deleteMany({}),
      Room.deleteMany({}),
      Bed.deleteMany({}),
      Booking.deleteMany({}),
      RoomChangeRequest.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('👤 Creating Owners & Students...');

    // 1. Owners
    const owner1 = await User.create({
      name: 'Ramesh Reddy',
      email: 'owner@example.com',
      password: 'Owner@123',
      phone: '+91 9876543210',
      role: 'owner',
    });

    await OwnerProfile.create({
      userId: owner1._id,
      phone: '+91 9876543210',
      hostelName: 'Sri Sai Grand Residency',
      hostelAddress: 'Plot 45, Near Tech Park, OMR Road',
      city: 'Chennai',
    });

    const owner2 = await User.create({
      name: 'Vikram Sharma',
      email: 'sharma@example.com',
      password: 'Owner@123',
      phone: '+91 9812345678',
      role: 'owner',
    });

    await OwnerProfile.create({
      userId: owner2._id,
      phone: '+91 9812345678',
      hostelName: 'Greenwood Luxury Student Living',
      hostelAddress: '12th Cross, Electronic City Phase 1',
      city: 'Bangalore',
    });

    // 2. Students
    const student1 = await User.create({
      name: 'Lokesh Kumar',
      email: 'student@example.com',
      password: 'Student@123',
      phone: '+91 9123456780',
      role: 'student',
    });

    await StudentProfile.create({
      userId: student1._id,
      college: 'SRM Institute of Science & Technology',
      department: 'Computer Science and Engineering',
      year: '2nd Year',
      gender: 'Male',
      preferences: {
        maxBudget: 8000,
        preferredRoomType: '2 Sharing',
        preferredFloor: 1,
        facilities: ['Wi-Fi', 'Mess Food', 'CCTV Security'],
      },
    });

    const student2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: 'Student@123',
      phone: '+91 9234567891',
      role: 'student',
    });

    await StudentProfile.create({
      userId: student2._id,
      college: 'Anna University',
      department: 'Information Technology',
      year: '3rd Year',
      gender: 'Female',
      preferences: {
        maxBudget: 7000,
        preferredRoomType: '3 Sharing',
        preferredFloor: 2,
        facilities: ['Wi-Fi', 'AC', 'Mess Food'],
      },
    });

    const student3 = await User.create({
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      password: 'Student@123',
      phone: '+91 9345678902',
      role: 'student',
    });

    await StudentProfile.create({
      userId: student3._id,
      college: 'VIT Chennai',
      department: 'Mechanical Engineering',
      year: '1st Year',
      gender: 'Male',
      preferences: {
        maxBudget: 6000,
        preferredRoomType: '4 Sharing',
        preferredFloor: 1,
        facilities: ['Wi-Fi', 'Mess Food'],
      },
    });

    const student4 = await User.create({
      name: 'Ananya Iyer',
      email: 'ananya@example.com',
      password: 'Student@123',
      phone: '+91 9456789013',
      role: 'student',
    });

    await StudentProfile.create({
      userId: student4._id,
      college: 'IIT Madras',
      department: 'Electrical Engineering',
      year: '2nd Year',
      gender: 'Female',
      preferences: {
        maxBudget: 9000,
        preferredRoomType: 'Single',
        preferredFloor: 2,
        facilities: ['Wi-Fi', 'AC', 'Gym'],
      },
    });

    const student5 = await User.create({
      name: 'Kiran Patel',
      email: 'kiran@example.com',
      password: 'Student@123',
      phone: '+91 9567890124',
      role: 'student',
    });

    await StudentProfile.create({
      userId: student5._id,
      college: 'Tech University',
      department: 'Civil Engineering',
      year: '4th Year',
      gender: 'Male',
      preferences: {
        maxBudget: 10000,
        preferredRoomType: '2 Sharing',
        preferredFloor: 1,
        facilities: ['Wi-Fi', 'Power Backup', 'Laundry'],
      },
    });

    console.log('🏢 Creating Hostels...');

    // Hostel 1 (Owned by Ramesh Reddy)
    const hostel1 = await Hostel.create({
      ownerId: owner1._id,
      name: 'Sri Sai Grand Residency',
      description: 'Modern, high-tech student accommodation located 5 minutes from top colleges. Featuring visual smart bed selection, high-speed fiber internet, and hygienic food.',
      address: 'Plot 45, Near Tech Park, OMR Road',
      city: 'Chennai',
      gender: 'Co-ed',
      monthlyRent: 5000,
      facilities: ['Wi-Fi', 'AC', 'Mess Food', 'Laundry', 'CCTV Security', 'Power Backup', 'Gym', 'Study Room'],
      images: [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
      ],
      rating: 4.8,
      status: 'active',
    });

    // Hostel 2 (Owned by Vikram Sharma)
    const hostel2 = await Hostel.create({
      ownerId: owner2._id,
      name: 'Greenwood Luxury Student Living',
      description: 'Ultra-comfortable hostel with premium single and 2-sharing rooms, air conditioning, daily housekeeping, and peaceful study areas.',
      address: '12th Cross, Electronic City Phase 1',
      city: 'Bangalore',
      gender: 'Boys',
      monthlyRent: 8500,
      facilities: ['Wi-Fi', 'AC', 'Mess Food', 'Housekeeping', 'Power Backup', 'Study Room'],
      images: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
      ],
      rating: 4.9,
      status: 'active',
    });

    // Hostel 3 (Owned by Ramesh Reddy)
    const hostel3 = await Hostel.create({
      ownerId: owner1._id,
      name: "Elite Women's Executive Hostel",
      description: 'Exclusive and safe residence for female students with biometric security, in-house warden, wholesome South & North Indian meals, and spacious balcony rooms.',
      address: 'Road No 36, Jubilee Hills',
      city: 'Hyderabad',
      gender: 'Girls',
      monthlyRent: 5500,
      facilities: ['Wi-Fi', 'CCTV Security', 'Mess Food', 'Laundry', 'Power Backup'],
      images: [
        'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1000&q=80',
      ],
      rating: 4.7,
      status: 'active',
    });

    console.log('🛏️ Creating Rooms and Beds with diverse statuses...');

    // Rooms for Hostel 1:
    // Floor 1:
    // Room 101: 4 Sharing (₹5,000)
    // Room 102: 2 Sharing (₹6,500)
    // Floor 2:
    // Room 201: Single (₹9,000)
    // Room 202: 3 Sharing (₹5,500)

    const room101 = await Room.create({
      hostelId: hostel1._id,
      roomNumber: '101',
      floor: 1,
      roomType: '4 Sharing',
      capacity: 4,
      monthlyRent: 5000,
    });

    const room102 = await Room.create({
      hostelId: hostel1._id,
      roomNumber: '102',
      floor: 1,
      roomType: '2 Sharing',
      capacity: 2,
      monthlyRent: 6500,
    });

    const room201 = await Room.create({
      hostelId: hostel1._id,
      roomNumber: '201',
      floor: 2,
      roomType: 'Single',
      capacity: 1,
      monthlyRent: 9000,
    });

    const room202 = await Room.create({
      hostelId: hostel1._id,
      roomNumber: '202',
      floor: 2,
      roomType: '3 Sharing',
      capacity: 3,
      monthlyRent: 5500,
    });

    // Beds for Room 101:
    // Bed 1: OCCUPIED by student3 (Rahul Verma)
    // Bed 2: AVAILABLE (for student demo booking!)
    // Bed 3: AVAILABLE
    // Bed 4: MAINTENANCE
    const bed101_1 = await Bed.create({
      roomId: room101._id,
      hostelId: hostel1._id,
      bedNumber: 'Bed 1',
      status: 'occupied',
      price: 5000,
      currentStudentId: student3._id,
    });

    const bed101_2 = await Bed.create({
      roomId: room101._id,
      hostelId: hostel1._id,
      bedNumber: 'Bed 2',
      status: 'available',
      price: 5000,
    });

    const bed101_3 = await Bed.create({
      roomId: room101._id,
      hostelId: hostel1._id,
      bedNumber: 'Bed 3',
      status: 'available',
      price: 5000,
    });

    const bed101_4 = await Bed.create({
      roomId: room101._id,
      hostelId: hostel1._id,
      bedNumber: 'Bed 4',
      status: 'maintenance',
      price: 5000,
    });

    // Booking for Rahul Verma in Bed 1
    const bookingRahul = await Booking.create({
      studentId: student3._id,
      hostelId: hostel1._id,
      roomId: room101._id,
      bedId: bed101_1._id,
      moveInDate: new Date('2026-10-01'),
      duration: 12,
      monthlyRent: 5000,
      status: 'approved',
    });
    bed101_1.currentBookingId = bookingRahul._id;
    await bed101_1.save();

    // Beds for Room 102:
    // Bed 1: OCCUPIED by student5 (Kiran Patel)
    // Bed 2: AVAILABLE
    const bed102_1 = await Bed.create({
      roomId: room102._id,
      hostelId: hostel1._id,
      bedNumber: 'Bed 1',
      status: 'occupied',
      price: 6500,
      currentStudentId: student5._id,
    });

    const bed102_2 = await Bed.create({
      roomId: room102._id,
      hostelId: hostel1._id,
      bedNumber: 'Bed 2',
      status: 'available',
      price: 6500,
    });

    const bookingKiran = await Booking.create({
      studentId: student5._id,
      hostelId: hostel1._id,
      roomId: room102._id,
      bedId: bed102_1._id,
      moveInDate: new Date('2026-09-15'),
      duration: 6,
      monthlyRent: 6500,
      status: 'approved',
    });
    bed102_1.currentBookingId = bookingKiran._id;
    await bed102_1.save();

    // Beds for Room 201 (Single):
    // Bed 1: AVAILABLE
    const bed201_1 = await Bed.create({
      roomId: room201._id,
      hostelId: hostel1._id,
      bedNumber: 'Bed 1',
      status: 'available',
      price: 9000,
    });

    // Beds for Room 202 (3 Sharing):
    // Bed 1: PENDING (requested by student2 Priya Sharma)
    // Bed 2: AVAILABLE
    // Bed 3: AVAILABLE
    const bed202_1 = await Bed.create({
      roomId: room202._id,
      hostelId: hostel1._id,
      bedNumber: 'Bed 1',
      status: 'pending',
      price: 5500,
    });

    const bed202_2 = await Bed.create({
      roomId: room202._id,
      hostelId: hostel1._id,
      bedNumber: 'Bed 2',
      status: 'available',
      price: 5500,
    });

    const bed202_3 = await Bed.create({
      roomId: room202._id,
      hostelId: hostel1._id,
      bedNumber: 'Bed 3',
      status: 'available',
      price: 5500,
    });

    // Pending booking for Priya Sharma in Room 202 Bed 1
    const bookingPriya = await Booking.create({
      studentId: student2._id,
      hostelId: hostel1._id,
      roomId: room202._id,
      bedId: bed202_1._id,
      moveInDate: new Date('2026-11-01'),
      duration: 6,
      monthlyRent: 5500,
      status: 'pending',
    });
    bed202_1.currentBookingId = bookingPriya._id;
    await bed202_1.save();

    // Rooms for Hostel 2 (Greenwood):
    const roomG1 = await Room.create({
      hostelId: hostel2._id,
      roomNumber: 'A-101',
      floor: 1,
      roomType: '2 Sharing',
      capacity: 2,
      monthlyRent: 8500,
    });

    await Bed.create({
      roomId: roomG1._id,
      hostelId: hostel2._id,
      bedNumber: 'Bed 1',
      status: 'available',
      price: 8500,
    });

    await Bed.create({
      roomId: roomG1._id,
      hostelId: hostel2._id,
      bedNumber: 'Bed 2',
      status: 'available',
      price: 8500,
    });

    // Rooms for Hostel 3 (Elite Women's):
    const roomE1 = await Room.create({
      hostelId: hostel3._id,
      roomNumber: 'W-201',
      floor: 2,
      roomType: '2 Sharing',
      capacity: 2,
      monthlyRent: 5500,
    });

    await Bed.create({
      roomId: roomE1._id,
      hostelId: hostel3._id,
      bedNumber: 'Bed 1',
      status: 'available',
      price: 5500,
    });

    await Bed.create({
      roomId: roomE1._id,
      hostelId: hostel3._id,
      bedNumber: 'Bed 2',
      status: 'available',
      price: 5500,
    });

    console.log('🔔 Creating Seed Notifications...');

    await Notification.create({
      userId: owner1._id,
      message: 'New booking request from Priya Sharma for Room 202 (Bed 1).',
      type: 'booking',
      link: '/owner/bookings',
    });

    await Notification.create({
      userId: student3._id,
      message: 'Your booking request was approved! Room 101 • Bed 1 at Sri Sai Grand Residency.',
      type: 'approval',
      link: '/student/my-room',
    });

    console.log('✅ Database seeded successfully with realistic data!');
    console.log('======================================================');
    console.log('🔑 DEMO CREDENTIALS:');
    console.log('👨🎓 Student: student@example.com / Password: Student@123');
    console.log('🏠 Owner:   owner@example.com   / Password: Owner@123');
    console.log('======================================================');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
};

module.exports = seedData;
