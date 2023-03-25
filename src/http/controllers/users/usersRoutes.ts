import { FastifyInstance } from 'fastify'
import { makeUsersController } from '../../controllers/factories/makeUsersController'
import { verifyJWT } from '../../middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  const usersController = makeUsersController()

  app.post('/users', (req, reply) => usersController.registerUser(req, reply))

  /* Authenticated */
  // app.addHook('onRequest', verifyJWT)

  app.get('/users', { onRequest: [verifyJWT] }, (req, reply) =>
    usersController.listUsers(req, reply),
  )
  app.get('/profile', { onRequest: [verifyJWT] }, (req, reply) =>
    usersController.profile(req, reply),
  )
}
