import { NextFunction, Request, Response, Router } from 'express'
import { GetPokemons } from '../../../../application/use-cases/get-pokemons'
import { GetPokemonsById } from '../../../../application/use-cases/get-pokemons-by-id'
import { GetPokemonsByPokedexRef } from '../../../../application/use-cases/get-pokemons-by-pokedex-ref'
import { Pagination } from '../../../../shared/constants'
import { PrismaPokemonRepositoryDatabase } from '../../../database/prisma/repositories/prisma-pokemon-repository-database'
import { validatorHandler } from '../../middlewares/validator-handler'
import { FindAllPokemonsByPokedexRefDto } from './dtos/find-all-pokemons-by-pokedex-ref-dto'
import { FindAllPokemonsDto } from './dtos/find-all-pokemons-dto'
import { FindOnePokemonByIdDto } from './dtos/find-one-pokemon-by-id-dto'

const pokemonsRouter = Router()

pokemonsRouter.get('/', validatorHandler(FindAllPokemonsDto, ['query']), async (req: Request, res: Response, _next: NextFunction) => {
  const { limit, offset, name, generation, evolution_stage, type_1, type_2 } = req.query
  const pokemonRepository = new PrismaPokemonRepositoryDatabase()
  const getPokemons = new GetPokemons(pokemonRepository)
  const paginationParams = {
    limit: limit ? Number(limit) : Pagination.DEFAULT_LIMIT,
    offset: offset ? Number(offset) : Pagination.DEFAULT_OFFSET,
  }
  const equalityFilters = {
    generation: generation ? Number(generation) : null,
    evolution_stage: evolution_stage ? (evolution_stage as string) : null,
    type_1: type_1 ? (type_1 as string) : null,
    type_2: type_2 ? (type_2 as string) : null,
  }
  const similarityFilters = {
    name: name ? (name as string) : null,
  }
  const data = await getPokemons.execute({ paginationParams, equalityFilters, similarityFilters })
  res.status(200).json(data)
})

pokemonsRouter.get('/:id', validatorHandler(FindOnePokemonByIdDto, ['params']), async (req: Request, res: Response, next: NextFunction) => {
  const pokemonRepository = new PrismaPokemonRepositoryDatabase()
  const getPokemonsById = new GetPokemonsById(pokemonRepository)
  const { id } = req.params
  try {
    const pokemon = await getPokemonsById.execute(Number(id))
    res.status(200).json(pokemon)
  } catch (error: any) {
    next(error)
  }
})

pokemonsRouter.get('/pokedex/:ref', validatorHandler(FindAllPokemonsByPokedexRefDto, ['params']), async (req: Request, res: Response, _next: NextFunction) => {
  const pokemonRepository = new PrismaPokemonRepositoryDatabase()
  const getPokemonsByPokedexRef = new GetPokemonsByPokedexRef(pokemonRepository)
  const { ref } = req.params
  const pokemons = await getPokemonsByPokedexRef.execute(Number(ref))
  res.status(200).json(pokemons)
})

export { pokemonsRouter }
