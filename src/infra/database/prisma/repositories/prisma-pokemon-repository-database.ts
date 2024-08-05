import { Prisma } from '@prisma/client'
import { FindAllPokemonsInput, PokemonDataInput, PokemonDataStorage, PokemonRepository } from '../../../../application/repositories/pokemon-repository'
import { PrismaPokemonMapper } from '../mappers/prisma-pokemon-mapper'
import { prismaClient } from '../prisma-client'

export class PrismaPokemonRepositoryDatabase implements PokemonRepository {
  async saveAll(pokemons: PokemonDataInput[]): Promise<void> {
    const pokemonsDataInputPrisma: Prisma.PokemonsCreateInput[] = pokemons.map(PrismaPokemonMapper.toPrisma)
    await prismaClient.$transaction([
      // prismaClient.pokemons.deleteMany(),
      prismaClient.pokemons.createMany({
        data: pokemonsDataInputPrisma,
        skipDuplicates: true,
      }),
    ])
  }

  async findAll(input: FindAllPokemonsInput): Promise<any> {
    const query = this.createQueryWithPaginationAndFilters(input)
    const total = await prismaClient.pokemons.count()
    const pokemons: PokemonDataStorage[] = await prismaClient.pokemons.findMany(query)
    return { total, pokemons }
  }

  async findOneById(id: number): Promise<PokemonDataStorage | null> {
    const pokemon: PokemonDataStorage | null = await prismaClient.pokemons.findUnique({
      where: {
        id,
      },
    })
    return pokemon
  }

  async deleteAll(): Promise<void> {
    await prismaClient.pokemons.deleteMany()
  }

  async findAllByPokedexRef(ref: number): Promise<PokemonDataStorage[]> {
    const pokemons: PokemonDataStorage[] = await prismaClient.pokemons.findMany({
      where: {
        pokedex_ref: ref,
      },
    })
    return pokemons
  }

  private createQueryWithPaginationAndFilters(input: FindAllPokemonsInput) {
    const { paginationParams, equalityFilters, similarityFilters } = input
    const where: Prisma.PokemonsWhereInput = {}
    const and: Prisma.Enumerable<Prisma.PokemonsWhereInput> = []
    if (equalityFilters) {
      for (const filter in equalityFilters) {
        if (equalityFilters[filter]) {
          and.push({ [filter]: equalityFilters[filter] })
        }
      }
    }
    if (similarityFilters) {
      for (const filter in similarityFilters) {
        if (similarityFilters[filter]) {
          and.push({ [filter]: { startsWith: similarityFilters[filter], mode: 'insensitive' } })
        }
      }
    }
    where.AND = and
    const orderBy: Prisma.Enumerable<Prisma.PokemonsOrderByWithRelationInput> = { id: 'asc' }
    const take = paginationParams.limit
    const skip = paginationParams.offset
    const query = { where, orderBy, take, skip }
    return query
  }
}
