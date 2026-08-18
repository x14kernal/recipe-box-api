import { AppError } from './AppError.js';

export class ConflictError extends AppError {
  constructor(
    message = 'The resource cannot be deleted because it is referenced by another resource.'
  ) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}
