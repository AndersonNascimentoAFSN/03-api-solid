import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../../middlewares/verify-jwt'

import { makeCheckInController } from './factory/make-check-in-controller'

export async function checkInsRoutes(app: FastifyInstance) {
  const checkInsController = makeCheckInController()

  /* Authenticated */
  app.addHook('onRequest', verifyJWT)

  app.get('/check-ins/history', (req, reply) =>
    checkInsController.checkInsHistory(req, reply),
  )
  app.get('/check-ins/metrics', (req, reply) =>
    checkInsController.checkInsCount(req, reply),
  )

  app.post('/gyms/:gymId/check-ins', (req, reply) =>
    checkInsController.checkInCreate(req, reply),
  )
  app.patch('/check-ins/:checkInId/validate', (req, reply) =>
    checkInsController.checkInValidate(req, reply),
  )
}
