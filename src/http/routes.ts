import { FastifyInstance } from 'fastify'

import { usersControllers } from './controlllers/usersControllers'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', usersControllers)
}
