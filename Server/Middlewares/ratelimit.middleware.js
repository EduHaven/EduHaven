import rateLimit from "express-rate-limit";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { ipBlocker } from "../security/ipBlocker.js";

export function createLoginRateLimiter(options = {}) {
  const ipLimiter = new RateLimiterMemory({
    points: options.ipPoints || 10,
    duration: options.ipDuration || 300,
  });

  const userLimiter = new RateLimiterMemory({
    points: options.userPoints || 5,
    duration: options.userDuration || 900,
  });

  return async (req, res, next) => {
    await ipBlocker(req, res, async () => {
      try {
        const ip = req.ip;
        const email = req.body.email;

        await ipLimiter.consume(ip);

        if (email) {
          await userLimiter.consume(email);
        }

        next();
      } catch (rejRes) {
        return res.status(429).json({
          success: false,
          error: "Too many login attempts. Try again later.",
          retryAfter: Math.round(rejRes.msBeforeNext / 1000),
        });
      }
    });
  };
}

export function createSignupRateLimiter(options = {}) {
  const limiter = rateLimit({
    windowMs: options.windowMs || 60 * 60 * 1000,
    max: options.max || 20,
    handler: (req, res) => {
      return res.status(429).json({
        success: false,
        error: "Too many signup attempts from this IP. Try again later.",
      });
    },
  });

  return async (req, res, next) => {
    await ipBlocker(req, res, () => {
      limiter(req, res, next);
    });
  };
}
