import { z as zod } from 'zod'

export const FindAllPokemonsByPokedexRefDto = zod.object({
  ref: zod.coerce.number({ invalid_type_error: 'must be a number type' }).positive('must be a value greater than zero').optional(),
})
