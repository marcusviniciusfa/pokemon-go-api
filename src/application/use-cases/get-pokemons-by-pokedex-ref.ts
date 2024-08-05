import { PokemonDataStorage, PokemonRepository } from '../repositories/pokemon-repository'

export class GetPokemonsByPokedexRef {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(ref: number): Promise<PokemonDataStorage[]> {
    const pokemons = await this.pokemonRepository.findAllByPokedexRef(ref)
    return pokemons
  }
}
