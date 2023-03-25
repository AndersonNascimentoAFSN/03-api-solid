import { fastifyJwt } from '@fastify/jwt'
import fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { appRoutes } from './http/routes'
import { usersRoutes } from './http/controllers/users/usersRoutes'
import { gymsRoutes } from './http/controllers/gyms/gymsRoutes'
import { checkInsRoutes } from './http/controllers/check-ins/checkInsRoutes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(appRoutes, { prefix: '/v1' })
app.register(usersRoutes, { prefix: '/v1' })
app.register(gymsRoutes, { prefix: '/v1' })
app.register(checkInsRoutes, { prefix: '/v1' })

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
