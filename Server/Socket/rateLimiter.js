import { RateLimiterMemory } from "rate-limiter-flexible";

// Rate limiting configuration from environment variables
const SOCKET_MESSAGE_LIMIT = parseInt(process.env.SOCKET_MESSAGE_LIMIT) || 10; // messages per minute
const SOCKET_ROOM_LIMIT = parseInt(process.env.SOCKET_ROOM_LIMIT) || 5; // room operations per minute
const SOCKET_TYPING_LIMIT = parseInt(process.env.SOCKET_TYPING_LIMIT) || 20; // typing events per minute

// Create rate limiters for different socket events
const messageLimiter = new RateLimiterMemory({
  points: SOCKET_MESSAGE_LIMIT, // Number of requests
  duration: 60, // Per 60 seconds (1 minute)
  blockDuration: 60, // Block for 60 seconds if limit exceeded
});

const roomLimiter = new RateLimiterMemory({
  points: SOCKET_ROOM_LIMIT,
  duration: 60,
  blockDuration: 30, // Shorter block for room operations
});

const typingLimiter = new RateLimiterMemory({
  points: SOCKET_TYPING_LIMIT,
  duration: 60,
  blockDuration: 10, // Very short block for typing
});

/**
 * Creates a rate limiting middleware for socket events
 * @param {RateLimiterMemory} limiter - The rate limiter instance
 * @param {string} eventType - Type of event for error messages
 * @returns {Function} Middleware function
 */
const createSocketRateLimit = (limiter, eventType) => {
  return async (socket, data, callback) => {
    try {
      // Use userId as the key for rate limiting
      await limiter.consume(socket.userId);
      return true; // Allow the event to proceed
    } catch (rejRes) {
      // Rate limit exceeded
      const remainingTime = Math.round(rejRes.msBeforeNext / 1000);
      const errorMessage = `Rate limit exceeded for ${eventType}. Try again in ${remainingTime} seconds.`;

      console.warn(
        `Rate limit exceeded for user ${socket.userId} on ${eventType}`
      );

      // Send error to client
      socket.emit("rate_limit_error", {
        eventType,
        message: errorMessage,
        retryAfter: remainingTime,
      });

      return false; // Block the event
    }
  };
};

// Export configured rate limiters
export const messageRateLimit = createSocketRateLimit(
  messageLimiter,
  "message"
);
export const roomRateLimit = createSocketRateLimit(
  roomLimiter,
  "room_operation"
);
export const typingRateLimit = createSocketRateLimit(typingLimiter, "typing");

// Export rate limiter stats for monitoring
export const getRateLimiterStats = () => {
  return {
    messageLimit: SOCKET_MESSAGE_LIMIT,
    roomLimit: SOCKET_ROOM_LIMIT,
    typingLimit: SOCKET_TYPING_LIMIT,
  };
};
