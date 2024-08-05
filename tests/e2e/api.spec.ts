import axios, { AxiosError } from 'axios'
import { beforeAll, describe, expect, it } from 'vitest'
import xlsx from 'xlsx'
import pokemonsData from '../pokemons.json'

describe('[testes end-to-end] verificando o comportamento da api', () => {
  const maxPokemons = 389
  const workbook = xlsx.utils.book_new()
  const worksheet = xlsx.utils.json_to_sheet(pokemonsData)
  xlsx.utils.book_append_sheet(workbook, worksheet, 'sheet')
  const formData = new FormData()
  const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  formData.append('file', blob, 'pokemons.xlsx')

  describe('POST /api/uploads', () => {
    it.only('deve receber um arquivo do tipo xlsx', async () => {
      const { status } = await axios.post('http://localhost:3000/api/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const { data } = await axios.get(`http://localhost:3000/api/pokemons?limit=${maxPokemons + 1}&offset=0`)
      expect(status).toBe(201)
      expect(data).toHaveLength(maxPokemons)
    })

    it('deve responder com "bad request" caso o tipo do arquivo não seja xlsx', async () => {
      expect.hasAssertions()
      const invalidFormData = new FormData()
      invalidFormData.append('file', new Blob([], { type: 'application/pdf' }))
      try {
        await axios.post('http://localhost:3000/api/uploads', invalidFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      } catch (error) {
        expect((error as AxiosError).response?.status).toBe(400)
        expect((error as AxiosError).response?.data).toHaveProperty('error', 'invalid file. send a file of type xlsx ❌')
      }
    })

    it('deve responder com "bad request" caso não exista um arquivo na requisição', async () => {
      expect.hasAssertions()
      const emptyFormData = new FormData()
      try {
        await axios.post('http://localhost:3000/api/uploads', emptyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      } catch (error) {
        expect((error as AxiosError).response?.status).toBe(400)
        expect((error as AxiosError).response?.data).toHaveProperty('error', 'file is required ❌')
      }
    })
  })
  describe('APIs a partir do path /api/pokemons', () => {
    beforeAll(async () => {
      await axios.post('http://localhost:3000/api/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    })

    describe('GET /api/pokemons', () => {
      it('deve retornar os 10 primeiros pokemons', async () => {
        const { data, status } = await axios.get('http://localhost:3000/api/pokemons')
        const defaultLimit = 100
        expect(status).toBe(200)
        expect(data).toHaveLength(defaultLimit)
        expect(data[0]).toHaveProperty('name', 'Bulbasaur')
        expect(data[9]).toHaveProperty('name', 'Caterpie')
      })

      it('deve retornar os pokemons usando filtros de paginação com query strings na url', async () => {
        const { data, status } = await axios.get('http://localhost:3000/api/pokemons?offset=10&limit=10')
        expect(status).toBe(200)
        expect(data).toHaveLength(10)
        expect(data[0]).toHaveProperty('name', 'Metapod')
        expect(data[9]).toHaveProperty('name', 'Raticate')
      })

      it('deve retornar um pokemon filtrando pelo nome com a query string "name" na url', async () => {
        const { data, status } = await axios.get('http://localhost:3000/api/pokemons?name=DeoXYS')
        expect(status).toBe(200)
        expect(data).toHaveLength(4)
        expect(data[0]).toHaveProperty('name', 'Deoxys Defense')
        expect(data[0]).toHaveProperty('id', 386)
      })

      it('deve retornar um pokemon filtrando pela geração com a query string "generation" na url', async () => {
        const { data, status } = await axios.get('http://localhost:3000/api/pokemons?generation=3&limit=1&offset=0')
        expect(status).toBe(200)
        expect(data[0]).toHaveProperty('name', 'Treecko')
        expect(data[0]).toHaveProperty('id', 252)
      })

      it.each(['1', '2', '3'])('deve retornar um pokemon filtrando pelo estágio evolutivo = %d com a query string "evolution_stage" na url', async (evolutionStage) => {
        const { data, status } = await axios.get(`http://localhost:3000/api/pokemons?evolution_stage=${evolutionStage}&generation=3&limit=3&offset=0`)
        expect(status).toBe(200)
        expect(data[0]).toHaveProperty('evolution_stage', evolutionStage)
        expect(data[1]).toHaveProperty('evolution_stage', evolutionStage)
        expect(data[2]).toHaveProperty('evolution_stage', evolutionStage)
      })

      it.each(['grass', 'fire', 'water'])('deve retornar um pokemon filtrando pelo primeiro tipo = %s com a query string "type_1" na url', async (type1) => {
        const { data, status } = await axios.get(`http://localhost:3000/api/pokemons?generation=3&limit=3&offset=0&type_1=${type1}`)
        expect(status).toBe(200)
        expect(data[0]).toHaveProperty('type_1', type1)
        expect(data[1]).toHaveProperty('type_1', type1)
        expect(data[2]).toHaveProperty('type_1', type1)
      })

      it.each([
        ['grass', 'poison'],
        ['rock', 'ground'],
        ['normal', 'flying'],
      ])('deve retornar um pokemon filtrando pelos primeiro tipo = %s e segundo tipo = %s com as queries string "type_1" e "type_2" na url', async (type1, type2) => {
        const { data, status } = await axios.get(`http://localhost:3000/api/pokemons?limit=3&offset=0&type_1=${type1}&type_2=${type2}`)
        expect(status).toBe(200)
        expect(data[0]).toHaveProperty('type_1', type1)
        expect(data[0]).toHaveProperty('type_2', type2)
        expect(data[1]).toHaveProperty('type_1', type1)
        expect(data[1]).toHaveProperty('type_2', type2)
        expect(data[2]).toHaveProperty('type_1', type1)
        expect(data[2]).toHaveProperty('type_2', type2)
      })
    })

    describe('GET /api/pokemons/{id}', () => {
      it('deve retornar um pokemon pelo seu id', async () => {
        const { data, status } = await axios.get('http://localhost:3000/api/pokemons/389')
        expect(status).toBe(200)
        expect(data).toHaveProperty('name', 'Deoxys Speed')
      })

      it('deve retornar um "not found" caso o pokemon não exista', async () => {
        expect.hasAssertions()
        try {
          await axios.get('http://localhost:3000/api/pokemons/1000')
        } catch (error) {
          expect((error as AxiosError).response?.status).toBe(404)
          expect((error as AxiosError).response?.data).toHaveProperty('error', 'pokemon not found 🔎')
        }
      })
    })

    describe('GET /api/pokemons/pokedex/{ref}', () => {
      it('deve retornar um pokemon pela referência da pokedex', async () => {
        const { data, status } = await axios.get('http://localhost:3000/api/pokemons/pokedex/386')
        expect(status).toBe(200)
        expect(data).toHaveLength(4)
        expect(data[3]).toHaveProperty('name', 'Deoxys Speed')
      })
    })
  })

  describe('? /api/resource', () => {
    it('deve retornar um "not found" caso o recurso não exista', async () => {
      expect.hasAssertions()
      try {
        await axios.get('http://localhost:3000/api/resource')
      } catch (error) {
        expect((error as AxiosError).response?.status).toBe(404)
        expect((error as AxiosError).response?.data).toHaveProperty('error', 'requested path "/api/resource" not found 🔎')
      }
    })
  })
})
