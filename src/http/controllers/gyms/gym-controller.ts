import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { InterfaceGymController } from './interface/interface-gym-controller'
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
        return Math.abs(value) <= 180
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

  async searchGyms(request: FastifyRequest, reply: FastifyReply) {
    const searchGymsQuerySchema = z.object({
      q: z.string(),
      page: z.coerce.number().min(1).default(1),
    })

    const { q, page } = searchGymsQuerySchema.parse(request.query)

    const { gyms } = await this.gymService.searchGyms({
      query: q,
      page,
    })

    return reply.status(200).send({
      gyms,
    })
  }

  async nearByGyms(request: FastifyRequest, reply: FastifyReply) {
    const nearByGymsQueryBodySchema = z.object({
      latitude: z.coerce.number().refine((value) => {
        return Math.abs(value) <= 90
      }),
      longitude: z.coerce.number().refine((value) => {
        return Math.abs(value) <= 180
      }),
    })

    const { latitude, longitude } = nearByGymsQueryBodySchema.parse(
      request.query,
    )

    const { gyms } = await this.gymService.fetchNearbyGyms({
      userLatitude: latitude,
      userLongitude: longitude,
    })

    return reply.status(200).send({
      gyms,
    })
  }
}
