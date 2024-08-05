import xlsx from 'xlsx'
import { PokemonDataInput, PokemonRepository } from '../repositories/pokemon-repository'

export class UploadFile {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(buffer: Buffer): Promise<any> {
    const workbook = xlsx.read(buffer, { type: 'buffer' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const pokemons = xlsx.utils.sheet_to_json(worksheet) as PokemonDataInput[]
    await this.pokemonRepository.deleteAll()
    await this.pokemonRepository.saveAll(pokemons)
  }
}
