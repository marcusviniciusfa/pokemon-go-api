import { NextFunction, Request, Response } from 'express'
import { AppError } from '../../../shared/errors/app-error'
import { InternalServerError } from '../../../shared/errors/internal-server-error'

export async function errorHandler(error: AppError, _req: Request, res: Response, _next: NextFunction) {
  if (!error.statusCode) {
    error = new InternalServerError('internal server error')
  }
  res.status(error.statusCode).json({
    statusCode: error.statusCode,
    error: error.message.concat(` ${error.emoji}`),
  })
}
