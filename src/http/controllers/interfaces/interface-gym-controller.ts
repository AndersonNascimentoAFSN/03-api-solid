import { Gym } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'

export interface InterfaceGymController {
  listGyms(request: FastifyRequest, reply: FastifyReply): Promise<Gym[]>
}
