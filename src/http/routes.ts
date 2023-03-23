import { FastifyInstance } from 'fastify'
import { makeAuthenticateController } from './controllers/factories/makeAuthenticateController'
import { makeUsersController } from './controllers/factories/makeUsersController'
import { verifyJWT } from './middlewares/verify-jwt'

// import { makeGymController } from './controllers/factories/make-gym-controller'
// import { makeCheckInController } from './controllers/factories/make-check-in-controller'

export async function appRoutes(app: FastifyInstance) {
  const usersController = makeUsersController()
  const authenticateController = makeAuthenticateController()
  // const gymController = makeGymController()
  // const checkInController = makeCheckInController()

  app.post('/users', (req, reply) => usersController.registerUser(req, reply))
  app.post('/sessions', (req, reply) =>
    authenticateController.sessions(req, reply),
  )

  /* Authenticated */
  app.get('/users', { onRequest: [verifyJWT] }, (req, reply) =>
    usersController.listUsers(req, reply),
  )
  app.get('/profile', { onRequest: [verifyJWT] }, (req, reply) =>
    usersController.profile(req, reply),
  )
}
