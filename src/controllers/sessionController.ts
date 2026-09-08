import type { Request, Response } from 'express';
import * as sessionService from '../services/sessionService.js';
import { sendSuccess, sendSuccessWithoutData } from '../utils/apiResponse.js';

export async function getAllSessions(req: Request, res: Response) {
  const sessions = await sessionService.getAll(req.userId, req.sessionId);
  sendSuccess(res, sessions);
}

export async function deleteSession(req: Request<{ id: string }>, res: Response) {
  await sessionService.deleteBySessionId({ userId: req.userId, sessionId: req.params.id });
  return sendSuccessWithoutData(res);
}
