import { NextFunction, Request, Response } from 'express'
import { NotFoundError } from '../../../shared/errors/not-found-error'

export async function notFoundResourceHandler(req: Request, _res: Response, next: NextFunction) {
  next(new NotFoundError(`requested path "${req.originalUrl}" not found`))
}
