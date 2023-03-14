import { User } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'

export interface InterfaceUsersController {
  registerUser(request: FastifyRequest, reply: FastifyReply): Promise<never>
  listUsers(request: FastifyRequest, reply: FastifyReply): Promise<User[]>
}
