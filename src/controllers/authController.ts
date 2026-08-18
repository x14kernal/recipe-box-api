import type { Request, Response } from 'express';
import * as userService from '../services/userService.js';

export async function signup(req: Request, res: Response) {
  // if exists it will throw an error
  await userService.checkEmailAvailable(req.body.email);

  const user = await userService.create(req.body);
  return res.status(201).json({
    success: true,
    data: {
      user,
    },
  });
}

export async function login(req: Request, res: Response) {
  const { user, token } = await userService.checkCredentials(req.body);

  res.status(200).json({
    success: true,
    data: {
      user,
      token,
    },
  });
}
