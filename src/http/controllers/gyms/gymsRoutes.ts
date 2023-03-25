import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { makeGymController } from './factory/make-gym-controller'

export async function gymsRoutes(app: FastifyInstance) {
  const gymController = makeGymController()

  /* Authenticated */
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms', (req, reply) => gymController.createGym(req, reply))

  app.get('/gyms/search', (req, reply) => gymController.searchGyms(req, reply))

  app.get('/gyms/nearby', (req, reply) => gymController.nearByGyms(req, reply))
}
