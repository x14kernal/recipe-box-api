import type { Request, Response } from 'express';
import * as userService from '../services/userService.js';
import { sendSuccess, sendSuccessWithoutData } from '../utils/apiResponse.js';

export async function register(req: Request, res: Response) {
  // if any (email/username) exists it will throw an error
  await userService.checkEmailAvailable(req.body.email);
  await userService.checkUsernameAvailable(req.body.username);

  const user = await userService.create(req.body);
  return sendSuccess(res, user, 201);
}

export async function login(req: Request, res: Response) {
  const { user, token } = await userService.login({
    payload: req.body,
    ipAddr: req.ip ?? null,
    userAgent: req.get('user-agent') ?? null,
  });

  res.cookie('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000, // for 30 days
  });

  return sendSuccess(res, user);
}

export async function me(req: Request, res: Response) {
  const user = await userService.getOne(req.userId);
  return sendSuccess(res, user);
}

export async function logout(req: Request, res: Response) {
  await userService.logout(req.sessionId);

  res.clearCookie('session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return sendSuccessWithoutData(res);
}
