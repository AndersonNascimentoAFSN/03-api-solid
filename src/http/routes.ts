import { FastifyInstance } from 'fastify'
import { makeAuthenticateController } from './controllers/factories/makeAuthenticateController'

import { makeUsersController } from './controllers/factories/makeUsersController'

export async function appRoutes(app: FastifyInstance) {
  const usersController = makeUsersController()
  const authenticateController = makeAuthenticateController()

  app.post('/users', (req, reply) => usersController.registerUser(req, reply))
  app.get('/users', (req, reply) => usersController.listUsers(req, reply))

  app.post('/sessions', (req, reply) =>
    authenticateController.sessions(req, reply),
  )
}
