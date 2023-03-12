import { FastifyInstance } from 'fastify'

import { registerUsersController } from './controllers/registerUsersController'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUsersController)
}
