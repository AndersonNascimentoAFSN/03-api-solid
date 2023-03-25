import { FastifyInstance } from 'fastify'
import { makeAuthenticateController } from './controllers/factories/makeAuthenticateController'
import { makeUsersController } from './controllers/users/factory/makeUsersController'
// import { makeCheckInController } from './controllers/factories/make-check-in-controller'

export async function appRoutes(app: FastifyInstance) {
  const usersController = makeUsersController()
  const authenticateController = makeAuthenticateController()
  // const checkInController = makeCheckInController()

  app.post('/users', (req, reply) => usersController.registerUser(req, reply))
  app.post('/sessions', (req, reply) =>
    authenticateController.sessions(req, reply),
  )
}
