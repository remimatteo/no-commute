/**
 * Simple in-memory rate limiter
 *
 * Tracks requests by IP address and enforces limits to prevent abuse.
 * In production, consider using Redis for distributed rate limiting.
 */

const rateLimit = (options = {}) => {
  const {
    interval = 60 * 1000, // Default: 1 minute
    uniqueTokenPerInterval = 100, // Max requests per interval
  } = options;

  const tokenCache = new Map();

  return {
    check: (limit, token) =>
      new Promise((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0];

        if (tokenCount[0] === 0) {
          // First request from this IP - set cleanup timer
          tokenCache.set(token, tokenCount);
          setTimeout(() => {
            tokenCache.delete(token);
          }, interval);
        }

        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        return isRateLimited
          ? reject({ statusCode: 429, message: 'Rate limit exceeded' })
          : resolve({ limit, remaining: limit - currentUsage });
      }),
  };
};

export default rateLimit;
