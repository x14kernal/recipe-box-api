import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // maybe send to monitoring service like Sentry, DataDog, ..etc. you can do this here.
  console.error(err);

  // Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Others
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
