import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { AuthenticateService } from '@/services/authenticate'
import { InvalidCredentialsError } from '@/services/errors/invalidCredentialsError'
import { InterfaceAuthenticateController } from './interfaces/interfaceAuthenticateController'

export class AuthenticateController implements InterfaceAuthenticateController {
  private authenticateService: AuthenticateService

  constructor(authenticateService: AuthenticateService) {
    this.authenticateService = authenticateService
  }

  async sessions(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    try {
      await this.authenticateService.authenticate({
        email,
        password,
      })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.status(400).send({
          message: error.message,
          error: 'Bad request',
          statusCode: 400,
        })
      }

      throw error
    }

    return reply.status(200).send()
  }
}
