import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'student-vault-secret-change-in-production';

export interface AuthRequest extends Request {
  vaultId?: string;
}

export function generateToken(vaultId: string): string {
  return jwt.sign({ vaultId }, JWT_SECRET, { expiresIn: '24h' });
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  let tokenStr: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    tokenStr = authHeader.slice(7);
  } else if (typeof req.query.token === 'string') {
    tokenStr = req.query.token;
  }

  if (!tokenStr) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(tokenStr, JWT_SECRET) as { vaultId: string };
    req.vaultId = decoded.vaultId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
