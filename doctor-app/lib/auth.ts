import jwt from 'jsonwebtoken';
import { Role } from './types';

const SECRET = process.env.JWT_SECRET || 'docapp_secret_2024_xK9!';

export interface TokenPayload {
  id: string;
  email: string;
  role: Role;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function getTokenPayload(req: Request): TokenPayload | null {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/token=([^;]+)/);
  if (!match) return null;
  return verifyToken(match[1]);
}
