import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { UsersServices } from '@/services/usersServices'
import { UsersRepositoryPrisma } from '@/repositories/usersRepositoryPrisma'

export async function usersControllers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = registerBodySchema.parse(request.body)

  try {
    const usersRepository = new UsersRepositoryPrisma()
    const usersServices = new UsersServices(usersRepository)

    await usersServices.createUsers({
      name,
      email,
      password,
    })
  } catch (error) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
