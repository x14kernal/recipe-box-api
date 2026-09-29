import type { RequestHandler } from 'express';
import { validateSession } from '../services/sessionService.js';

export const optionalAuth: RequestHandler = async (req, _, next) => {
  const token = req.cookies.session;

  if (typeof token !== 'string') return next();

  const session = await validateSession(token);

  req.userId = session.user_id;
  req.sessionId = session.id;

  next();
};
