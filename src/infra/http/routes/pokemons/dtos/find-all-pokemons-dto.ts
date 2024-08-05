import { z as zod } from 'zod'

export const FindAllPokemonsDto = zod.object({
  limit: zod.coerce.number({ invalid_type_error: 'must be a number type' }).nonnegative('must be a value greater than or equal to zero').optional(),
  offset: zod.coerce.number({ invalid_type_error: 'must be a number type' }).nonnegative('must be a value greater than or equal to zero').optional(),
  name: zod.string({ invalid_type_error: 'must be a string type' }).optional(),
  generation: zod.coerce.number({ invalid_type_error: 'must be a number type' }).positive('must be a value greater than zero').optional(),
  evolution_stage: zod.string({ invalid_type_error: 'must be a string' }).optional(),
  type_1: zod.string({ invalid_type_error: 'must be a string' }).optional(),
  type_2: zod.string({ invalid_type_error: 'must be a string' }).optional(),
})
