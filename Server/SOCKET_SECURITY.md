# Socket.IO Security Implementation

## Overview

This document describes the security measures implemented for Socket.IO real-time features in EduHaven to address issue #868.

## Current Security Features

### 1. JWT Authentication ✅

- **Location**: `Server/Socket/socket.js` - `authenticateSocket` middleware
- **Implementation**: Validates JWT tokens on socket connection
- **Behavior**:
  - Rejects connections without valid tokens
  - Extracts user ID, name, and profile image from token
  - Sets user context on socket for all subsequent events

### 2. Rate Limiting ✅ (NEW)

- **Location**: `Server/Socket/rateLimiter.js`
- **Implementation**: Uses `rate-limiter-flexible` library
- **Protected Events**:
  - `send_message`: 10 messages/minute per user
  - `join_room`/`leave_room`: 5 operations/minute per user
  - `typing_start`/`typing_stop`: 20 events/minute per user

## Configuration

Rate limits are configurable via environment variables in `.env`:

```env
# Socket.IO Rate Limiting Configuration
SOCKET_MESSAGE_LIMIT=10    # messages per minute per user
SOCKET_ROOM_LIMIT=5        # room operations per minute per user
SOCKET_TYPING_LIMIT=20     # typing events per minute per user
```

## How Rate Limiting Works

1. **Per-User Limits**: Each user has separate rate limit counters based on their `userId`
2. **Event-Specific**: Different limits for different types of events
3. **Graceful Handling**: When limit exceeded:
   - Event is blocked from processing
   - Client receives `rate_limit_error` event with details
   - User can retry after the cooldown period

## Client-Side Error Handling

Clients should listen for rate limit errors:

```javascript
socket.on("rate_limit_error", (data) => {
  console.warn(`Rate limit: ${data.message}`);
  // Show user-friendly message
  // Retry after data.retryAfter seconds
});
```

## Testing

### Manual Testing

1. Start the server: `npm run dev`
2. Run the test script: `node Tests/socketRateLimit.test.js`

### Test Scenarios

- **Authentication**: Valid/invalid JWT tokens
- **Message Spam**: Send >10 messages rapidly
- **Room Spam**: Join/leave rooms rapidly
- **Normal Usage**: Verify legitimate usage still works

## Security Benefits

1. **Prevents Chat Spam**: Users cannot flood chat rooms with messages
2. **Prevents Room Hopping**: Limits rapid room join/leave operations
3. **Reduces Server Load**: Prevents abuse that could impact performance
4. **Maintains UX**: Legitimate users are not affected by reasonable limits

## Monitoring

Rate limiter stats are available via `getRateLimiterStats()` function for monitoring dashboards.

## Future Enhancements

1. **Database Integration**: Store rate limit violations for analysis
2. **Dynamic Limits**: Adjust limits based on user reputation/role
3. **IP-Based Limits**: Additional protection against distributed attacks
4. **Whitelist**: Allow higher limits for moderators/administrators
