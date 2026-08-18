import { AppError } from './AppError.js';

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Invalid email or password.') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}
