import { FastifyInstance } from 'fastify'

import { usersControllers } from './controllers/usersControllers'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', usersControllers)
}
