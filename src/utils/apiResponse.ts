import type { Response } from 'express';
import type { ApiError, ApiSuccess, ApiSuccessWithMeta } from '../types/api.js';

export function sendSuccess<T>(res: Response, data: T, status = 200): Response<ApiSuccess<T>> {
  return res.status(status).json({
    success: true,
    data,
    meta: {},
  });
}

export function sendSuccessWithMeta<T, M>(
  res: Response,
  data: T,
  meta: M,
  status = 200,
): Response<ApiSuccessWithMeta<T, M>> {
  return res.status(status).json({
    success: true,
    data,
    meta,
  });
}

export function sendSuccessWithoutData(res: Response): Response {
  return res.status(200).json({
    success: true,
    data: null,
    meta: {},
  });
}

export function sendError(
  res: Response,
  error: ApiError['error'],
  status: number,
): Response<ApiError> {
  return res.status(status).json({
    success: false,
    error,
  });
}
