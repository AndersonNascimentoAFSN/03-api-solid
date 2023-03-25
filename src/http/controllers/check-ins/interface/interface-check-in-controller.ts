import { FastifyReply, FastifyRequest } from 'fastify'

import { checkInsCountResponse } from '../types/checkInsCount'
import { CheckInHistoryResponse } from '../types/checkInsHistory'

export interface InterfaceCheckInsController {
  checkInCreate(request: FastifyRequest, reply: FastifyReply): Promise<never>

  checkInsHistory(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<CheckInHistoryResponse>

  checkInsCount(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<checkInsCountResponse>

  checkInValidate(request: FastifyRequest, reply: FastifyReply): Promise<never>
}
