import { RateLimiterMemory } from "rate-limiter-flexible";

const ipBlockerLimiter = new RateLimiterMemory({
  points: 5,
  duration: 600,
  blockDuration: 3600,
});

export const ipBlocker = async (req, res, next) => {
  const ip = req.ip;

  try {
    await ipBlockerLimiter.consume(ip);
    next();
  } catch (rejRes) {
    return res.status(429).json({
      success: false,
      error: "Your IP is temporarily blocked due to repeated violations.",
      retryAfter: Math.round(rejRes.msBeforeNext / 1000),
    });
  }
};
