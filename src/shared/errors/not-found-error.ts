import { AppError } from './app-error'

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message)
    this.statusCode = 404
    this.emoji = '🔎'
  }
}
