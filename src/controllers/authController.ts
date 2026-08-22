import type { Request, Response } from 'express';
import * as userService from '../services/userService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export async function signup(req: Request, res: Response) {
  // if exists it will throw an error
  await userService.checkEmailAvailable(req.body.email);

  const user = await userService.create(req.body);
  return sendSuccess(res, user, 201);
}

export async function login(req: Request, res: Response) {
  const { user, token } = await userService.checkCredentials(req.body);
  return sendSuccess(res, { user, token });
}

export async function me(req: Request, res: Response) {
  const user = await userService.getOne(req.userId);
  return sendSuccess(res, user);
}
