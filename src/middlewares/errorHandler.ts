import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
import { sendError } from '../utils/apiResponse.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // maybe send to monitoring service like Sentry, DataDog, ..etc. you can do this here.
  console.error(`ErrorHandler -> ${err}`);

  // Validation Errors
  if (err instanceof ZodError) {
    return sendError(
      res,
      {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
      400
    );
  }

  if (err instanceof AppError) {
    return sendError(
      res,
      {
        message: err.message,
        code: err.code,
      },
      err.statusCode
    );
  }

  // Others
  return sendError(
    res,
    {
      message: 'Internal Server Error',
      code: 'INTERNAL_SERVER_ERROR',
    },
    500
  );
};
