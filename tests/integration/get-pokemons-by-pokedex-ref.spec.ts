import { describe, expect, it, vi } from 'vitest'
import xlsx from 'xlsx'
import { PokemonRepository } from '../../src/application/repositories/pokemon-repository'
import { PokemonRepositoryFake } from '../database/repositories/pokemon-repository-fake'
import pokemonsData from '../pokemons.json'
import { GetPokemonsByPokedexRef, UploadFile } from './../../src/application/use-cases'

describe('[testes de integração] verificando caso de uso de buscar um pokemon pelo sua referência da pokedex', () => {
  const maxPokemons = 30
  const workbook = xlsx.utils.book_new()
  const worksheet = xlsx.utils.json_to_sheet(pokemonsData.slice(0, maxPokemons))
  xlsx.utils.book_append_sheet(workbook, worksheet, 'sheet')
  const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' })

  it('deve buscar apenas um pokemon pelo sua referência da pokedex (teste com fake e spy)', async () => {
    const pokemonRepositoryFake = new PokemonRepositoryFake()
    const pokemonRepositoryFindAllByPokedexRefSpy = vi.spyOn(pokemonRepositoryFake, 'findAllByPokedexRef')
    const uploadFile = new UploadFile(pokemonRepositoryFake)
    await uploadFile.execute(buffer)
    const getPokemons = new GetPokemonsByPokedexRef(pokemonRepositoryFake)
    const pokemons = await getPokemons.execute(25)
    expect(pokemonRepositoryFindAllByPokedexRefSpy).toHaveBeenCalledOnce()
    expect(pokemons[0]).toHaveProperty('name', 'Pikachu')
    expect(pokemons[0]).toHaveProperty('pokedex_ref', 25)
  })

  it('deve buscar apenas um pokemon pelo sua referência da pokedex (teste com stub)', async () => {
    const pokemonRepositoryStub: PokemonRepository = {
      deleteAll: vi.fn(),
      findAll: vi.fn(),
      findAllByPokedexRef: vi.fn().mockResolvedValue(
        Promise.resolve([
          {
            name: 'Pikachu',
            pokedex_ref: 25,
          },
        ]),
      ),
      findOneById: vi.fn(),
      saveAll: vi.fn(),
    }
    const getPokemons = new GetPokemonsByPokedexRef(pokemonRepositoryStub)
    const pokemons = await getPokemons.execute(25)
    expect(pokemons[0]).toHaveProperty('name', 'Pikachu')
    expect(pokemons[0]).toHaveProperty('pokedex_ref', 25)
  })
})
