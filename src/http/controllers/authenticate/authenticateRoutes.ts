import { FastifyInstance } from 'fastify'
import { makeAuthenticateController } from './factory/makeAuthenticateController'

export async function authenticateRoutes(app: FastifyInstance) {
  const authenticateController = makeAuthenticateController()

  app.post('/sessions', (req, reply) =>
    authenticateController.sessions(req, reply),
  )
}
