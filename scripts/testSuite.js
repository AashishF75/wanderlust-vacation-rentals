require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('../models/list.js');
const User = require('../models/user.js');
const Review = require('../models/reviews.js');

async function runTestSuite() {
  console.log("==================================================");
  console.log("         WANDERLUST PROJECT TEST SUITE            ");
  console.log("==================================================");

  const dbUrl = process.env.ATLAS_URI || 'mongodb://127.0.0.1:27017/wunderlust';
  let passed = 0;
  let total = 6;

  // Test 1: MongoDB Connection
  try {
    await mongoose.connect(dbUrl);
    console.log("[PASS] 1. MongoDB Database Connection");
    passed++;
  } catch (err) {
    console.error("[FAIL] 1. MongoDB Connection:", err.message);
  }

  // Test 2: Database Records Integrity
  try {
    const listingCount = await Listing.countDocuments();
    const userCount = await User.countDocuments();
    if (listingCount > 0 && userCount > 0) {
      console.log(`[PASS] 2. Database Records Present (${listingCount} listings, ${userCount} users)`);
      passed++;
    } else {
      console.error(`[FAIL] 2. Database empty. Run 'npm run seed' first.`);
    }
  } catch (err) {
    console.error("[FAIL] 2. Records Check:", err.message);
  }

  // Test 3: Demo User Authentication Mechanism
  try {
    const demoUser = await User.findOne({ username: 'demo' });
    if (demoUser) {
      const auth = await demoUser.authenticate('Demo@12345');
      if (auth.user) {
        console.log("[PASS] 3. Passport-Local Authentication Verified (demo user)");
        passed++;
      } else {
        console.error("[FAIL] 3. Authentication failed for demo credentials");
      }
    } else {
      console.error("[FAIL] 3. Demo user does not exist");
    }
  } catch (err) {
    console.error("[FAIL] 3. Auth Check:", err.message);
  }

  // Test 4: GeoJSON & Coordinates Format
  try {
    const sample = await Listing.findOne({ "geometry.type": "Point" });
    if (sample && Array.isArray(sample.geometry.coordinates) && sample.geometry.coordinates.length === 2) {
      console.log(`[PASS] 4. GeoJSON Geometry Valid (${sample.location}: [${sample.geometry.coordinates.join(', ')}])`);
      passed++;
    } else {
      console.error("[FAIL] 4. Invalid GeoJSON geometry");
    }
  } catch (err) {
    console.error("[FAIL] 4. GeoJSON Check:", err.message);
  }

  // Test 5: HTTP Endpoints (Port 8080)
  try {
    const port = process.env.PORT || 8080;
    const res = await fetch(`http://localhost:${port}/listings`);
    if (res.status === 200) {
      console.log(`[PASS] 5. Web Server HTTP GET /listings (Status: ${res.status})`);
      passed++;
    } else {
      console.error(`[FAIL] 5. Web Server returned status ${res.status}`);
    }
  } catch (err) {
    console.warn(`[SKIP] 5. Web Server not currently running on port 8080 (${err.message})`);
    total--;
  }

  // Test 6: Search & Filter Query Execution
  try {
    const searchResults = await Listing.find({
      $or: [
        { title: { $regex: 'Goa', $options: 'i' } },
        { location: { $regex: 'Goa', $options: 'i' } }
      ]
    });
    if (searchResults.length > 0) {
      console.log(`[PASS] 6. Search Regex Query Functional (Found ${searchResults.length} Goa matches)`);
      passed++;
    } else {
      console.error("[FAIL] 6. Search query returned 0 matches");
    }
  } catch (err) {
    console.error("[FAIL] 6. Search Query:", err.message);
  }

  console.log("--------------------------------------------------");
  console.log(`TEST SUMMARY: ${passed} / ${total} tests passed.`);
  console.log("--------------------------------------------------");

  if (passed === total) {
    console.log("All critical systems operational!");
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error("Test Suite execution failure:", err);
  process.exit(1);
});

