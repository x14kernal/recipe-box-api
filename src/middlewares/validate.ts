import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

export function validate(schema: ZodType): RequestHandler {
  return (req, res, next) => {
    req.body = schema.parse(req.body);
    next();
  };
}
