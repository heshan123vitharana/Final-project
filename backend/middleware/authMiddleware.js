
import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });
    // Use globalThis.process for ESM compatibility
  const jwtSecret = globalThis.process.env.JWT_SECRET;
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
