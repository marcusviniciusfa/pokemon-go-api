import { NextFunction, Request, Response } from 'express'
import { ZodObject } from 'zod'
import { BadRequestError } from '../../../shared/errors/bad-request-error'

type RequestFieldsToValidation = 'body' | 'params' | 'query'

interface RequestDataJoinToValidation {
  [field: string]: string
}

export function validatorHandler(dto: ZodObject<any>, fieldsToValidation: RequestFieldsToValidation[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    let dataToValidation: RequestDataJoinToValidation = {}
    fieldsToValidation.map((field) => {
      dataToValidation = { ...dataToValidation, ...req[field] }
    })
    const bodyCheck = dto.safeParse(dataToValidation)
    if (!bodyCheck.success) {
      const { path: field, message } = bodyCheck.error.issues[0]
      next(new BadRequestError(`${field} property ${message.toLowerCase()}`))
    }
    next()
  }
}
