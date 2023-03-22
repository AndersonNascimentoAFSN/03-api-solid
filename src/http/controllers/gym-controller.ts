import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { InterfaceGymController } from './interfaces/interface-gym-controller'
import { GymServices } from '@/services/gymService'

export class GymController implements InterfaceGymController {
  private gymService: GymServices

  constructor(gymService: GymServices) {
    this.gymService = gymService
  }

  async listGyms(request: FastifyRequest, reply: FastifyReply) {}
}
