import { FastifyReply, FastifyRequest } from 'fastify'

export interface InterfaceAuthenticateController {
  sessions(request: FastifyRequest, reply: FastifyReply): Promise<never>
}
