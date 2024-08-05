import { describe, expect, it, vi } from 'vitest'
import xlsx from 'xlsx'
import { PokemonRepository } from '../../src/application/repositories/pokemon-repository'
import { PokemonRepositoryFake } from '../database/repositories/pokemon-repository-fake'
import pokemonsData from '../pokemons.json'
import { GetPokemons, UploadFile } from './../../src/application/use-cases'

describe('[testes de integração] verificando caso de uso de upload de arquivo xlsx', () => {
  const maxPokemons = 10
  const workbook = xlsx.utils.book_new()
  const worksheet = xlsx.utils.json_to_sheet(pokemonsData.slice(0, maxPokemons))
  xlsx.utils.book_append_sheet(workbook, worksheet, 'sheet')
  const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' })

  describe('quando receber um arquivo xlsx', () => {
    it('deve deletar todos os pokemons e salvar os pokemons do arquivo (teste com fake e spy)', async () => {
      const pokemonRepositoryFake = new PokemonRepositoryFake()
      const pokemonRepositorySaveAllSpy = vi.spyOn(pokemonRepositoryFake, 'saveAll')
      const pokemonRepositoryDeleteAllSpy = vi.spyOn(pokemonRepositoryFake, 'deleteAll')
      const uploadFile = new UploadFile(pokemonRepositoryFake)
      await uploadFile.execute(buffer)
      const pokemons = await pokemonRepositoryFake.findAll({})
      expect(pokemonRepositoryDeleteAllSpy).toHaveBeenCalledOnce()
      expect(pokemonRepositorySaveAllSpy).toHaveBeenCalledOnce()
      expect(pokemons).toHaveLength(maxPokemons)
    })

    it('deve deletar todos os pokemons e salvar os pokemons do arquivo (teste com stub)', async () => {
      const pokemonRepositoryStub: PokemonRepository = {
        deleteAll: vi.fn(),
        findAll: vi.fn().mockResolvedValue(Promise.resolve([{}, {}])),
        findAllByPokedexRef: vi.fn(),
        findOneById: vi.fn(),
        saveAll: vi.fn().mockResolvedValue(Promise.resolve()),
      }
      const uploadFile = new UploadFile(pokemonRepositoryStub)
      const getPokemons = new GetPokemons(pokemonRepositoryStub)
      await uploadFile.execute(buffer)
      const pokemons = await getPokemons.execute({})
      expect(pokemons).toHaveLength(2)
    })
  })
})
