import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { InterfaceGymController } from './interfaces/interface-gym-controller'
import { GymServices } from '@/services/gymService'

export class GymController implements InterfaceGymController {
  private gymService: GymServices

  constructor(gymService: GymServices) {
    this.gymService = gymService
  }

  async createGym(request: FastifyRequest, reply: FastifyReply) {
    const createGymBodySchema = z.object({
      title: z.string(),
      description: z.string().nullable(),
      phone: z.string().nullable(),
      latitude: z.number().refine((value) => {
        return Math.abs(value) <= 90
      }),
      longitude: z.number().refine((value) => {
        return Math.abs(value) <= 90
      }),
    })

    const { title, description, phone, latitude, longitude } =
      createGymBodySchema.parse(request.body)

    await this.gymService.createGym({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return reply.status(201).send()
  }

  async listGyms(request: FastifyRequest, reply: FastifyReply) {}
}
