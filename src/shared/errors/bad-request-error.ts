import { AppError } from './app-error'

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message)
    this.statusCode = 400
    this.emoji = '❌'
  }
}
