import type { Request, Response } from 'express';
import { sendRecipeListResponse } from '../utils/listResponse.js';
import { parseRecipeQuery } from '../utils/recipeQuery.js';

import * as bookmarkService from '../services/bookmarkService.js';

export async function getAllBookmarks(req: Request, res: Response) {
  const query = parseRecipeQuery(req.query);
  const data = await bookmarkService.getMany(req.userId, query);
  return sendRecipeListResponse(res, data, query, '/bookmarks');
}
