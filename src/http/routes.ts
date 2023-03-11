import { FastifyInstance } from 'fastify'

import { register } from './controlllers/register'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
}
