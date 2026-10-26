const http = require('http');

const request = (path, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method,
      headers,
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (postData) req.write(postData);
    req.end();
  });
};

const runVerification = async () => {
  console.log('🧪 Starting HostelHub End-to-End Automated API Verification...');

  try {
    // 1. Owner Login
    console.log('\nStep 1: Owner Login (owner@example.com)...');
    const ownerLogin = await request('/auth/owner/login', 'POST', {
      email: 'owner@example.com',
      password: 'Owner@123',
    });
    if (!ownerLogin.data.success) throw new Error('Owner login failed');
    const ownerToken = ownerLogin.data.token;
    console.log(`✅ Owner logged in! Name: ${ownerLogin.data.user.name}, Role: ${ownerLogin.data.user.role}`);

    // 2. Student 2 (Priya Sharma) Login or Student 4 (Ananya Iyer) Login
    console.log('\nStep 2: Student Login (ananya@example.com)...');
    const studentLogin = await request('/auth/student/login', 'POST', {
      email: 'ananya@example.com',
      password: 'Student@123',
    });
    if (!studentLogin.data.success) throw new Error('Student login failed');
    const studentToken = studentLogin.data.token;
    console.log(`✅ Student logged in! Name: ${studentLogin.data.user.name}, Role: ${studentLogin.data.user.role}`);

    // 3. Search Hostels
    console.log('\nStep 3: Searching Hostels (GET /hostels)...');
    const hostelsRes = await request('/hostels');
    if (!hostelsRes.data.success || hostelsRes.data.data.length === 0)
      throw new Error('No hostels found');
    const sriSai = hostelsRes.data.data.find((h) => h.name.includes('Sri Sai'));
    console.log(`✅ Found hostel: "${sriSai.name}" in ${sriSai.city} with ${sriSai.availableBeds} available beds`);

    // 4. Inspect Hostel & Rooms
    console.log(`\nStep 4: Fetching details for ${sriSai.name}...`);
    const hostelDetails = await request(`/hostels/${sriSai._id}`);
    const room101 = hostelDetails.data.data.rooms.find((r) => r.roomNumber === '101');
    if (!room101) throw new Error('Room 101 not found');
    console.log(`✅ Found Room 101: ${room101.roomType}, Floor ${room101.floor}, Total Beds: ${room101.totalBeds}`);

    // 5. Verify Visual Bed States inside Room 101
    console.log('\nStep 5: Inspecting individual bed statuses in Room 101...');
    const bedsRes = await request(`/beds/room/${room101._id}`);
    const beds = bedsRes.data.data;
    beds.forEach((b) => {
      const icon = b.status === 'available' ? '🟢' : b.status === 'occupied' ? '🔴' : b.status === 'pending' ? '🟡' : '⚪';
      console.log(`   - ${b.bedNumber}: Status = ${b.status} (${icon}) Price: ₹${b.price}`);
    });

    const targetBed = beds.find((b) => b.status === 'available');
    if (!targetBed) throw new Error('No available bed found in Room 101 to book!');
    console.log(`\n🎯 Target available bed selected for booking test: ${targetBed.bedNumber} (🟢 Available)`);

    // 6. Student Books Target Bed
    console.log(`\nStep 6: Student books ${targetBed.bedNumber}...`);
    const bookingRes = await request(
      '/bookings',
      'POST',
      {
        hostelId: sriSai._id,
        roomId: room101._id,
        bedId: targetBed._id,
        moveInDate: '2026-11-01',
        duration: 6,
      },
      studentToken
    );

    if (!bookingRes.data.success) {
      throw new Error(`Booking failed: ${bookingRes.data.message}`);
    }
    const bookingId = bookingRes.data.data._id;
    console.log(`✅ Bed Booked! Booking ID: ${bookingId}, Status: ${bookingRes.data.data.status}`);

    // 7. Verify Bed status is now PENDING
    console.log(`\nStep 7: Verifying ${targetBed.bedNumber} is now PENDING (🟡)...`);
    const bedCheck = await request(`/beds/${targetBed._id}`, 'GET', null, studentToken);
    console.log(`✅ ${targetBed.bedNumber} current status: ${bedCheck.data.data.status} (🟡 Approval Pending)`);
    if (bedCheck.data.data.status !== 'pending')
      throw new Error('Bed status is not pending!');

    // 8. Owner checks Booking Requests Queue
    console.log('\nStep 8: Owner checking Booking Requests queue...');
    const ownerBookings = await request('/bookings/owner?status=pending', 'GET', null, ownerToken);
    const targetBooking = ownerBookings.data.data.find((b) => b._id === bookingId);
    if (!targetBooking) throw new Error('Booking request not found in owner queue');
    console.log(`✅ Found pending request from ${targetBooking.studentId?.name} for ${targetBooking.bedId?.bedNumber}`);

    // 9. Owner Approves Request
    console.log(`\nStep 9: Owner APPROVES the booking request...`);
    const approveRes = await request(`/bookings/${bookingId}/approve`, 'PUT', {}, ownerToken);
    if (!approveRes.data.success)
      throw new Error(`Failed to approve: ${approveRes.data.message}`);
    console.log(`✅ Booking approved by owner!`);

    // 10. Verify Bed status is now OCCUPIED (🔴)
    console.log(`\nStep 10: Verifying ${targetBed.bedNumber} is now OCCUPIED (🔴)...`);
    const bedOccupied = await request(`/beds/${targetBed._id}`, 'GET', null, ownerToken);
    console.log(`✅ ${targetBed.bedNumber} current status: ${bedOccupied.data.data.status} (🔴 Occupied by ${bedOccupied.data.data.currentStudentId?.name})`);
    if (bedOccupied.data.data.status !== 'occupied')
      throw new Error('Bed status is not occupied!');

    // 11. Student verifies My Room
    console.log('\nStep 11: Student checks "My Room" allocation...');
    const myRoomRes = await request('/bookings/my-room', 'GET', null, studentToken);
    if (!myRoomRes.data.hasRoom) throw new Error('Student has no room allocated');
    console.log(`✅ Student confirmed room allocation: Room ${myRoomRes.data.data.booking.roomId.roomNumber} (${myRoomRes.data.data.booking.bedId.bedNumber})`);
    console.log(`   Roommates count: ${myRoomRes.data.data.roommates.length}`);

    // 12. Smart Bed Recommendation Test
    console.log('\nStep 12: Testing Smart Bed Recommendation scoring engine...');
    const recRes = await request('/hostels/recommendations', 'POST', {
      maxBudget: 9000,
      preferredRoomType: '2 Sharing',
      preferredFloor: 1,
      facilities: ['Wi-Fi', 'Mess Food'],
    });
    if (recRes.data.data.length > 0) {
      const top = recRes.data.data[0];
      console.log(`✅ Top recommendation: Room ${top.room.roomNumber} (${top.bedNumber}) - Match: ${top.matchPercentage}%`);
      console.log(`   Checklist: ${top.reasons.join(', ')}`);
    }

    // 13. Owner Reports Test
    console.log('\nStep 13: Testing Owner Reports & Analytics...');
    const reportsRes = await request('/reports/owner', 'GET', null, ownerToken);
    const rep = reportsRes.data.data.summary;
    console.log(`✅ Owner Reports Summary:`);
    console.log(`   Total Beds: ${rep.totalBeds}`);
    console.log(`   Occupied Beds: ${rep.occupiedBeds}`);
    console.log(`   Available Beds: ${rep.availableBeds}`);
    console.log(`   Occupancy Rate: ${rep.occupancyRate}%`);
    console.log(`   Monthly Revenue: ₹${rep.monthlyRevenue.toLocaleString('en-IN')}`);

    console.log('\n===============================================================');
    console.log('🎉 ALL 13 END-TO-END WORKFLOW STEPS PASSED WITH 100% SUCCESS!');
    console.log('===============================================================\n');
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
};

runVerification();
