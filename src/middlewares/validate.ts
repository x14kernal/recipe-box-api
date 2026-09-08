import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

export function validate(
  schema: ZodType,
  source: 'body' | 'query' | 'params' = 'body',
): RequestHandler {
  return (req, _, next) => {
    const result = schema.parse(req[source]);
    if (source === 'body') req[source] = result;
    next();
  };
}
