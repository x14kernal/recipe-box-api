import type { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse.js';
import * as ingredintService from '../services/ingredientService.js';

export async function getAllIngredients(_: Request, res: Response) {
  const ingredints = await ingredintService.getAll();
  return sendSuccess(res, ingredints);
}
