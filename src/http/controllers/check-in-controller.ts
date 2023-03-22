import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { InterfaceCheckInsController } from './interfaces/interface-check-in-controller'
import { CheckInService } from '../../services/checkInService'

export class CheckInsController implements InterfaceCheckInsController {
  private checkInsService: CheckInService

  constructor(checkInsService: CheckInService) {
    this.checkInsService = checkInsService
  }

  async listCheckIns(request: FastifyRequest, reply: FastifyReply) {}
}
