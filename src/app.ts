import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { prisma } from './lib/prisma'

export const app = fastify()

app.register(appRoutes)

app.get('/users', async (request, reply) => {
  const users = await prisma.user.findMany()

  return reply.status(200).send({ users })
})
