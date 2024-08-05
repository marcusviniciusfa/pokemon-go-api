export interface PokemonRepository {
  saveAll(pokemons: PokemonDataInput[]): Promise<void>
  findAll(input: FindAllPokemonsInput): Promise<any>
  findOneById(id: number): Promise<PokemonDataStorage | null>
  deleteAll(): Promise<void>
  findAllByPokedexRef(ref: number): Promise<PokemonDataStorage[]>
}

export interface FindAllPokemonsInput {
  paginationParams: { limit: number; offset: number }
  equalityFilters?: { [filter: string]: string | number | null }
  similarityFilters?: { [filter: string]: string | null }
}

export interface PokemonDataInput {
  ['Row']: number
  ['Name']: string
  ['Pokedex Number']: number
  ['Img name']: string
  ['Generation']: number
  ['Evolution Stage']: string
  ['Evolved']: number
  ['FamilyID']: number
  ['Type 1']: string
  ['Type 2']: string
  ['Weather 1']: string
  ['Weather 2']: string
  ['STAT TOTAL']: number
  ['ATK']: number
  ['DEF']: number
  ['STA']: number
  ['Legendary']: number
}

export interface PokemonDataStorage {
  id: number
  name: string | null
  pokedex_ref: number | null
  image_name: string | null
  generation: number | null
  evolution_stage: string | null
  evolved: number | null
  family_id: number | null
  type_1: string | null
  type_2: string | null
  weather_1: string | null
  weather_2: string | null
  stat_total: number | null
  attack: number | null
  defense: number | null
  stamina: number | null
  legendary: number | null
}
