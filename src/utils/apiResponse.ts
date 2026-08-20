import type { Response } from 'express';
import type { ApiError, ApiSuccess, ApiSuccessWithMeta } from '../types/api.js';

export function sendSuccess<T>(
  res: Response,
  data: T,
  status = 200
): Response<ApiSuccess<T>> {
  return res.status(status).json({
    success: true,
    data,
  });
}

export function sendSuccessWithMeta<T, M>(
  res: Response,
  data: T,
  meta: M,
  status = 200
): Response<ApiSuccessWithMeta<T, M>> {
  return res.status(status).json({
    success: true,
    data,
    meta,
  });
}

export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

export function sendError(
  res: Response,
  error: ApiError['error'],
  status: number
): Response<ApiError> {
  return res.status(status).json({
    success: false,
    error,
  });
}
