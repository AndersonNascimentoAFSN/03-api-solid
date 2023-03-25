import { Gym } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'

export interface InterfaceGymController {
  createGym(request: FastifyRequest, reply: FastifyReply): Promise<Gym>

  searchGyms(request: FastifyRequest, reply: FastifyReply): Promise<Gym[]>

  nearByGyms(request: FastifyRequest, reply: FastifyReply): Promise<Gym[]>
}
