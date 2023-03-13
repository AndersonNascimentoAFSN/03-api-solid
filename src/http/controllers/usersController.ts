import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { UsersServices } from '../../services/usersServices'
import { UserAlreadyExistsError } from '@/services/errors/userAlreadyExistsEmailError'

export class UsersController {
  private usersService: UsersServices

  constructor(usersService: UsersServices) {
    this.usersService = usersService
    // this.registerUser = this.registerUser.bind(this)
  }

  async registerUser(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, name, password } = registerBodySchema.parse(request.body)

    try {
      await this.usersService.createUsers({
        name,
        email,
        password,
      })
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        return reply.status(409).send({
          message: error.message,
          error: 'Conflict',
          statusCode: 409,
        })
      }

      throw error
    }

    return reply.status(201).send()
  }
}
