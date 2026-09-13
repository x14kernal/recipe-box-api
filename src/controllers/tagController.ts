import type { Request, Response } from 'express';
import * as tagService from '../services/tagService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export async function getAllTags(_: Request, res: Response) {
  const tags = await tagService.getAll();
  return sendSuccess(res, tags);
}
