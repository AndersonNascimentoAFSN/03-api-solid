import { FastifyInstance } from 'fastify'
import { makeUsersController } from './factory/makeUsersController'
import { verifyJWT } from '../../middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  const usersController = makeUsersController()

  /* Authenticated */
  app.addHook('onRequest', verifyJWT)

  app.get('/users', (req, reply) => usersController.listUsers(req, reply))

  app.get('/profile', (req, reply) => usersController.profile(req, reply))

  // app.get('/profile', { onRequest: [verifyJWT] }, (req, reply) =>
  //   usersController.profile(req, reply),
  // )
}
