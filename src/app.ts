import fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { appRoutes } from './http/routes'
import { prisma } from './lib/prisma'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler(
  (error: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: 'Validation error.', issues: error.format() })
    }

    if (env.NODE_ENV !== 'production') {
      console.log(error)
    } else {
      // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
    }

    return reply
      .status(500)
      .send({ message: 'Internal Server Error', statusCode: 500 })
  },
)

app.get('/users', async (request, reply) => {
  const users = await prisma.user.findMany()

  return reply.status(200).send({ users })
})
