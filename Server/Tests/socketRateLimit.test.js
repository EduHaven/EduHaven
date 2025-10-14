/**
 * Socket.IO Rate Limiting Test Script
 *
 * This script tests the rate limiting functionality for Socket.IO events.
 * Run this after starting the server to verify rate limits are working.
 *
 * Usage:
 * 1. Start the server: npm run dev
 * 2. Run this test: node Tests/socketRateLimit.test.js
 */

import { io } from "socket.io-client";
import jwt from "jsonwebtoken";

// Configuration
const SERVER_URL = "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET || "add_random_string";

// Create a test JWT token
const testUser = {
  id: "test_user_123",
  FirstName: "Test",
  LastName: "User",
  email: "test@example.com",
};

const testToken = jwt.sign(testUser, JWT_SECRET, { expiresIn: "1h" });

console.log("🧪 Starting Socket.IO Rate Limiting Tests...\n");

// Test message rate limiting
async function testMessageRateLimit() {
  return new Promise((resolve) => {
    console.log("📨 Testing message rate limiting...");

    const socket = io(SERVER_URL, {
      auth: {
        token: testToken,
      },
    });

    let messagesSent = 0;
    let rateLimitHit = false;

    socket.on("connect", () => {
      console.log("✅ Connected to server");

      // Join a test room first
      socket.emit("join_room", { roomId: "test_room_123" });

      // Send messages rapidly to trigger rate limit
      const sendMessages = () => {
        if (messagesSent < 15) {
          // Try to exceed the limit of 10
          socket.emit("send_message", {
            roomId: "test_room_123",
            message: `Test message ${messagesSent + 1}`,
            messageType: "text",
          });
          messagesSent++;
          setTimeout(sendMessages, 100); // Send every 100ms
        }
      };

      setTimeout(sendMessages, 1000); // Start after joining room
    });

    socket.on("rate_limit_error", (data) => {
      console.log(`🚫 Rate limit hit: ${data.message}`);
      rateLimitHit = true;

      setTimeout(() => {
        socket.disconnect();
        resolve({
          test: "message_rate_limit",
          passed: rateLimitHit && messagesSent > 10,
          messagesSent,
          rateLimitHit,
        });
      }, 1000);
    });

    socket.on("new_message", (data) => {
      console.log(`📨 Message sent: ${data.message}`);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Connection failed:", error.message);
      resolve({
        test: "message_rate_limit",
        passed: false,
        error: error.message,
      });
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      socket.disconnect();
      resolve({
        test: "message_rate_limit",
        passed: false,
        error: "Test timed out",
        messagesSent,
        rateLimitHit,
      });
    }, 10000);
  });
}

// Test room operation rate limiting
async function testRoomRateLimit() {
  return new Promise((resolve) => {
    console.log("\n🏠 Testing room operation rate limiting...");

    const socket = io(SERVER_URL, {
      auth: {
        token: testToken,
      },
    });

    let roomOpsCount = 0;
    let rateLimitHit = false;

    socket.on("connect", () => {
      console.log("✅ Connected to server");

      // Rapidly join/leave rooms to trigger rate limit
      const roomOperations = () => {
        if (roomOpsCount < 8) {
          // Try to exceed the limit of 5
          const roomId = `test_room_${roomOpsCount}`;
          socket.emit("join_room", { roomId });

          setTimeout(() => {
            socket.emit("leave_room", { roomId });
          }, 50);

          roomOpsCount++;
          setTimeout(roomOperations, 200);
        }
      };

      setTimeout(roomOperations, 500);
    });

    socket.on("rate_limit_error", (data) => {
      console.log(`🚫 Rate limit hit: ${data.message}`);
      rateLimitHit = true;

      setTimeout(() => {
        socket.disconnect();
        resolve({
          test: "room_rate_limit",
          passed: rateLimitHit && roomOpsCount >= 5,
          roomOpsCount,
          rateLimitHit,
        });
      }, 1000);
    });

    socket.on("room_joined", (data) => {
      console.log(`🏠 Joined room: ${data.roomId}`);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Connection failed:", error.message);
      resolve({
        test: "room_rate_limit",
        passed: false,
        error: error.message,
      });
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      socket.disconnect();
      resolve({
        test: "room_rate_limit",
        passed: false,
        error: "Test timed out",
        roomOpsCount,
        rateLimitHit,
      });
    }, 10000);
  });
}

// Test authentication (should already work)
async function testAuthentication() {
  return new Promise((resolve) => {
    console.log("\n🔐 Testing authentication...");

    // Test with invalid token
    const socketInvalid = io(SERVER_URL, {
      auth: {
        token: "invalid_token",
      },
    });

    socketInvalid.on("connect_error", (error) => {
      console.log("✅ Authentication correctly rejected invalid token");
      socketInvalid.disconnect();

      // Test with valid token
      const socketValid = io(SERVER_URL, {
        auth: {
          token: testToken,
        },
      });

      socketValid.on("connect", () => {
        console.log("✅ Authentication correctly accepted valid token");
        socketValid.disconnect();
        resolve({
          test: "authentication",
          passed: true,
        });
      });

      socketValid.on("connect_error", (error) => {
        console.error("❌ Valid token was rejected:", error.message);
        resolve({
          test: "authentication",
          passed: false,
          error: error.message,
        });
      });
    });

    // Timeout
    setTimeout(() => {
      socketInvalid.disconnect();
      resolve({
        test: "authentication",
        passed: false,
        error: "Test timed out",
      });
    }, 5000);
  });
}

// Run all tests
async function runTests() {
  try {
    const results = [];

    results.push(await testAuthentication());
    results.push(await testMessageRateLimit());
    results.push(await testRoomRateLimit());

    console.log("\n" + "=".repeat(50));
    console.log("📊 TEST RESULTS");
    console.log("=".repeat(50));

    results.forEach((result) => {
      const status = result.passed ? "✅ PASSED" : "❌ FAILED";
      console.log(`${status} - ${result.test}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      if (result.messagesSent) {
        console.log(`   Messages sent: ${result.messagesSent}`);
      }
      if (result.roomOpsCount) {
        console.log(`   Room operations: ${result.roomOpsCount}`);
      }
    });

    const passedTests = results.filter((r) => r.passed).length;
    console.log(`\n🎯 ${passedTests}/${results.length} tests passed`);

    if (passedTests === results.length) {
      console.log(
        "🎉 All tests passed! Socket.IO security is working correctly."
      );
    } else {
      console.log("⚠️  Some tests failed. Check the server configuration.");
    }
  } catch (error) {
    console.error("💥 Test runner failed:", error);
  }

  process.exit(0);
}

// Check if server is running first
console.log(`🔍 Testing connection to ${SERVER_URL}...`);
runTests();
