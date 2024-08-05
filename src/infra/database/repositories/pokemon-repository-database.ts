import { FindAllPokemonsInput, PokemonDataInput, PokemonDataStorage, PokemonRepository } from '../../../application/repositories/pokemon-repository'
import { DatabaseConnection } from '../database-connection'

export class PokemonRepositoryDatabase implements PokemonRepository {
  constructor(readonly databaseConnection: DatabaseConnection) {}

  async saveAll(input: PokemonDataInput[]): Promise<void> {
    try {
      await this.databaseConnection.query('BEGIN')
      input.map(async (pokemon) => {
        const preparedStatement = {
          name: 'save-all-pokemons',
          text: 'insert into pokemons (id, name, pokedex_ref, image_name, generation, evolution_stage, evolved, family_id, type_1, type_2, weather_1, weather_2, stat_total, attack, defense, stamina, legendary) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);',
          values: [
            pokemon['Row'],
            pokemon['Name'] ?? null,
            pokemon['Pokedex Number'] ?? null,
            pokemon['Img name'] ? String(pokemon['Img name']) : null,
            pokemon['Generation'] ?? null,
            pokemon['Evolution Stage'] ? String(pokemon['Evolution Stage']) : null,
            pokemon['Evolved'] ?? null,
            pokemon['FamilyID'] ?? null,
            pokemon['Type 1'] ?? null,
            pokemon['Type 2'] ?? null,
            pokemon['Weather 1'] ?? null,
            pokemon['Weather 2'] ?? null,
            pokemon['STAT TOTAL'] ?? null,
            pokemon['ATK'] ?? null,
            pokemon['DEF'] ?? null,
            pokemon['STA'] ?? null,
            pokemon['Legendary'] ?? null,
          ],
        }
        await this.databaseConnection.query(preparedStatement)
        await this.databaseConnection.release()
      })
      await this.databaseConnection.query('COMMIT')
    } catch (error) {
      await this.databaseConnection.query('ROLLBACK')
    } finally {
      this.databaseConnection.release()
    }
  }

  async findAll(input: FindAllPokemonsInput): Promise<PokemonDataStorage[]> {
    const preparedStatement = this.createStatementWithPaginationAndFilters(input)
    const { rows: pokemons } = await this.databaseConnection.query(preparedStatement)
    this.databaseConnection.release()
    return pokemons
  }

  async findOneById(id: number): Promise<PokemonDataStorage | null> {
    const preparedStatement = {
      name: 'find-one-pokemon-by-id',
      text: 'select * from pokemons where id = $1;',
      values: [id],
    }
    const {
      rows: [pokemon],
    } = await this.databaseConnection.query(preparedStatement)
    this.databaseConnection.release()
    return pokemon
  }

  async deleteAll(): Promise<void> {
    const preparedStatement = {
      name: 'delete-all-pokemons',
      text: 'delete from pokemons;',
    }
    await this.databaseConnection.query(preparedStatement)
    this.databaseConnection.release()
  }

  async findAllByPokedexRef(ref: number): Promise<PokemonDataStorage[]> {
    const preparedStatement = {
      name: 'find-all-pokemons-by-pokedex-ref',
      text: 'select * from pokemons where pokedex_ref = $1 order by id asc;',
      values: [ref],
    }
    const { rows: pokemons } = await this.databaseConnection.query(preparedStatement)
    this.databaseConnection.release()
    return pokemons
  }

  private createStatementWithPaginationAndFilters(input: FindAllPokemonsInput) {
    const { paginationParams, equalityFilters, similarityFilters } = input
    let text = 'select * from pokemons where true'
    let values: Array<string | number | null> = []
    if (equalityFilters) {
      for (const filter in equalityFilters) {
        if (equalityFilters[filter]) {
          text += ` and ${filter} = $${values.length + 1}`
          values.push(equalityFilters[filter])
        }
      }
    }
    if (similarityFilters) {
      for (const filter in similarityFilters) {
        if (similarityFilters[filter]) {
          text += ` and ${filter} ilike $${values.length + 1}`
          values.push(`${similarityFilters[filter]}%`)
        }
      }
    }
    text += ` order by id asc limit $${values.length + 1} offset $${values.length + 2};`
    values = [...values, paginationParams.limit, paginationParams.offset]
    return {
      name: 'find-all-pokemons',
      text,
      values,
    }
  }
}
