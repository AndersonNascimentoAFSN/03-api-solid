import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { UsersServices } from '../../services/usersServices'
import { UserAlreadyExistsError } from '@/services/errors/userAlreadyExistsEmailError'
import { InterfaceUsersController } from './interfaces/interfaceUsersController'

export class UsersController implements InterfaceUsersController {
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

  async listUsers(_request: FastifyRequest, reply: FastifyReply) {
    const users = await this.usersService.getUsersProfiles()

    return reply.status(200).send(users)
  }

  async profile(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify()

      const { user } = await this.usersService.getUserProfile({
        userId: request.user.sub,
      })

      return reply
        .status(200)
        .send({ user: { ...user, password_hash: undefined } })
    } catch (error) {}
  }
}
