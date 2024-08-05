import { NotFoundError } from '../../shared/errors/not-found-error'
import { PokemonDataStorage, PokemonRepository } from '../repositories/pokemon-repository'

export class GetPokemonsById {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(id: number): Promise<PokemonDataStorage> {
    const pokemon = await this.pokemonRepository.findOneById(id)
    if (!pokemon) {
      throw new NotFoundError('pokemon not found')
    }
    return pokemon
  }
}
