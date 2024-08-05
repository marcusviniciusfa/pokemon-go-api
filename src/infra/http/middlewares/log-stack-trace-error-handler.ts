import { NextFunction, Request, Response } from 'express'

export async function logStackTraceErrorHandler(error: Error, _req: Request, _res: Response, next: NextFunction) {
  console.error(error.stack)
  next(error)
}
