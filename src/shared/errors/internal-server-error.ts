import { AppError } from './app-error'

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message)
    this.statusCode = 500
    this.emoji = '💥'
  }
}
