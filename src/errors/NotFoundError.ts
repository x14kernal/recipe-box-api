import { AppError } from './AppError.js';

export class NotFoundError extends AppError {
  constructor(message: string = 'The requested resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}
