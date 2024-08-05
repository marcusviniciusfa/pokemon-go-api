import { FindAllPokemonsInput, PokemonRepository } from '../repositories/pokemon-repository'

export class GetPokemons {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(input: FindAllPokemonsInput): Promise<any> {
    const { total, pokemons } = await this.pokemonRepository.findAll(input)
    const {
      paginationParams: { limit, offset },
    } = input
    const totalPages = Math.ceil(total / limit)
    const currentPage = Math.abs(Math.ceil((total - offset) / limit - totalPages))
    const data = {
      current_page: currentPage,
      total_per_page: limit,
      total_pages: totalPages,
      total,
      pokemons,
    }
    return data
  }
}
