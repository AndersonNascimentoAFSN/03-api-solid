import { CheckIn } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'

export interface InterfaceCheckInsController {
  listCheckIns(request: FastifyRequest, reply: FastifyReply): Promise<CheckIn[]>
}
