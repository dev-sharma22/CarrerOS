import rateLimit from 'express-rate-limit';

/**
 * Recursive HTML escaping for user inputs to prevent Cross-Site Scripting (XSS)
 */
const escapeHtmlString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const sanitizeXSS = (req, res, next) => {
  const sanitizeObj = (obj) => {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          // Avoid escaping code snippets submitted in code compiler workspace
          if (key === 'code' || key === 'answer' || key === 'content') continue;
          obj[key] = escapeHtmlString(obj[key]);
        } else if (typeof obj[key] === 'object') {
          sanitizeObj(obj[key]);
        }
      }
    }
  };

  sanitizeObj(req.body);
  sanitizeObj(req.query);
  sanitizeObj(req.params);
  next();
};

/**
 * Strict Rate Limiter for Authentication routes (Login / Register)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 login/register attempts per IP per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes for security purposes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
