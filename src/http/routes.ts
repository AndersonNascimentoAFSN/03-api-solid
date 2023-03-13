import { FastifyInstance } from 'fastify'

import { makeUsersController } from './controllers/factories/makeUsersController'

export async function appRoutes(app: FastifyInstance) {
  const usersController = makeUsersController()
  app.post('/users', (req, reply) => usersController.registerUser(req, reply))
}
