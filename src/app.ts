import 'express-async-errors'

import express from 'express'
import { errorHandler } from './infra/http/middlewares/error-handler'
import { logStackTraceErrorHandler } from './infra/http/middlewares/log-stack-trace-error-handler'
import { notFoundResourceHandler } from './infra/http/middlewares/not-found-resource-handler'
import { routes } from './infra/http/routes'

const app = express()
app.use(express.json())
app.use('/api', routes)
app.use('*', notFoundResourceHandler)
app.use(logStackTraceErrorHandler)
app.use(errorHandler)

const SERVER_PORT = process.env.SERVER_PORT

app.listen(SERVER_PORT, () => {
  console.log(`[log] server listening 👂 on port ${SERVER_PORT}`)
})

export { app }
