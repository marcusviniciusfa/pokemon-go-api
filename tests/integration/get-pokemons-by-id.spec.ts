import { describe, expect, it, vi } from 'vitest'
import xlsx from 'xlsx'
import { PokemonRepository } from '../../src/application/repositories/pokemon-repository'
import { PokemonRepositoryFake } from '../database/repositories/pokemon-repository-fake'
import pokemonsData from '../pokemons.json'
import { GetPokemonsById, UploadFile } from './../../src/application/use-cases'

describe('[testes de integração] verificando caso de uso de buscar um pokemon pelo id', () => {
  const maxPokemons = 30
  const workbook = xlsx.utils.book_new()
  const worksheet = xlsx.utils.json_to_sheet(pokemonsData.slice(0, maxPokemons))
  xlsx.utils.book_append_sheet(workbook, worksheet, 'sheet')
  const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' })

  it('deve buscar apenas um pokemon pelo seu id (teste com fake e spy)', async () => {
    const pokemonRepositoryFake = new PokemonRepositoryFake()
    const pokemonRepositoryFindByIdSpy = vi.spyOn(pokemonRepositoryFake, 'findOneById')
    const uploadFile = new UploadFile(pokemonRepositoryFake)
    await uploadFile.execute(buffer)
    const getPokemon = new GetPokemonsById(pokemonRepositoryFake)
    const pokemon = await getPokemon.execute(25)
    expect(pokemonRepositoryFindByIdSpy).toHaveBeenCalledOnce()
    expect(pokemon).toHaveProperty('name', 'Pikachu')
  })

  it('deve buscar apenas um pokemon pelo seu id (teste com stub)', async () => {
    const pokemonRepositoryStub: PokemonRepository = {
      deleteAll: vi.fn(),
      findAll: vi.fn(),
      findAllByPokedexRef: vi.fn(),
      findOneById: vi.fn().mockResolvedValue(
        Promise.resolve({
          name: 'Pikachu',
          id: 25,
        }),
      ),
      saveAll: vi.fn(),
    }
    const getPokemon = new GetPokemonsById(pokemonRepositoryStub)
    const pokemon = await getPokemon.execute(25)
    expect(pokemon).toHaveProperty('name', 'Pikachu')
    expect(pokemon).toHaveProperty('id', 25)
  })
})
