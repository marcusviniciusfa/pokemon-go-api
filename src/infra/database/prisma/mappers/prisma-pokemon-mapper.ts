import { Prisma } from '@prisma/client'
import { PokemonDataInput } from '../../../../application/repositories/pokemon-repository'

export class PrismaPokemonMapper {
  static toPrisma(pokemon: PokemonDataInput): Prisma.PokemonsCreateInput {
    return {
      id: pokemon['Row'],
      name: pokemon['Name'] ?? null,
      pokedex_ref: pokemon['Pokedex Number'] ?? null,
      image_name: pokemon['Img name'] ? String(pokemon['Img name']) : null,
      generation: pokemon['Generation'] ?? null,
      evolution_stage: pokemon['Evolution Stage'] ? String(pokemon['Evolution Stage']) : null,
      evolved: pokemon['Evolved'] ?? null,
      family_id: pokemon['FamilyID'] ?? null,
      type_1: pokemon['Type 1'] ?? null,
      type_2: pokemon['Type 2'] ?? null,
      weather_1: pokemon['Weather 1'] ?? null,
      weather_2: pokemon['Weather 2'] ?? null,
      stat_total: pokemon['STAT TOTAL'] ?? null,
      attack: pokemon['ATK'] ?? null,
      defense: pokemon['DEF'] ?? null,
      stamina: pokemon['STA'] ?? null,
      legendary: pokemon['Legendary'] ?? null,
    }
  }
}
