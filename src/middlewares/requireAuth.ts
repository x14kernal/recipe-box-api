import type { RequestHandler } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import jwt from 'jsonwebtoken';

export const requireAuth: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new UnauthorizedError('Not allowed');

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw new UnauthorizedError('Not allowed');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof payload === 'string' || !payload.userId)
      throw new UnauthorizedError('Not allowed');

    req.userId = payload.userId;
    next();
  } catch {
    throw new UnauthorizedError('Not allowed');
  }
};
