import { Router } from 'express'
import { pokemonsRouter } from './pokemons'
import { uploadsRouter } from './uploads'

const routes = Router()

routes.use('/uploads', uploadsRouter)
routes.use('/pokemons', pokemonsRouter)

export { routes }
