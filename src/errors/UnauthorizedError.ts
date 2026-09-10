import { AppError } from './AppError.js';

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Yor are allow to do this action.') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}
