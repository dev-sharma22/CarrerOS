/**
 * Sub-5ms In-Memory Response Caching Middleware for high scalability
 */
const cacheStore = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds cache TTL

export const cacheRoute = (ttlSeconds = 60) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cached = cacheStore.get(key);

    if (cached && (Date.now() - cached.timestamp < (ttlSeconds * 1000))) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached.data);
    }

    // Intercept res.json to store response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode === 200) {
        cacheStore.set(key, {
          timestamp: Date.now(),
          data
        });
      }
      res.setHeader('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
};

export const clearCache = () => {
  cacheStore.clear();
};
