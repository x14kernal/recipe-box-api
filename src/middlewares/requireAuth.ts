import type { RequestHandler } from 'express';
import { validateSession } from '../services/sessionService.js';
import { UnauthorizedError } from '../errors/index.js';

export const requireAuth: RequestHandler = async (req, _, next) => {
  const token = req.cookies.session;
  if (typeof token !== 'string') throw new UnauthorizedError('Not allowed');

  const session = await validateSession(token);

  req.userId = session.user_id;
  req.sessionId = session.id;

  next();
};
