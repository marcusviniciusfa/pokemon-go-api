import { z as zod } from 'zod'

export const FindOnePokemonByIdDto = zod.object({
  id: zod.coerce.number({ invalid_type_error: 'must be a number type' }).positive('must be a value greater than zero').optional(),
})
