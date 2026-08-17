import { AppError } from './AppError.js';

export class ForbiddenError extends AppError {
  constructor(message: string = "You don't have access for this operation") {
    super(message, 401);
    this.name = 'ForbiddenError';
  }
}
