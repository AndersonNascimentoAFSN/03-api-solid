import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { InterfaceCheckInsController } from './interface/interface-check-in-controller'
import { CheckInService } from '../../../services/checkInService'
import { checkInsCountResponse } from './types/checkInsCount'
import { CheckInHistoryResponse } from './types/checkInsHistory'

export class CheckInsController implements InterfaceCheckInsController {
  private checkInsService: CheckInService

  constructor(checkInsService: CheckInService) {
    this.checkInsService = checkInsService
  }

  async checkInCreate(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<never> {
    const createCheckInParamsSchema = z.object({
      gymId: z.string().uuid(),
    })

    const createCheckInBodySchema = z.object({
      latitude: z.number().refine((value) => {
        return Math.abs(value) <= 90
      }),
      longitude: z.number().refine((value) => {
        return Math.abs(value) <= 180
      }),
    })

    const { gymId } = createCheckInParamsSchema.parse(request.params)

    const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

    this.checkInsService.checkIn({
      gymId,
      userId: request.user.sub,
      userLatitude: latitude,
      userLongitude: longitude,
    })

    return reply.status(201).send()
  }

  async checkInsHistory(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<CheckInHistoryResponse> {
    const checkInHistoryQuerySchema = z.object({
      page: z.coerce.number().min(1).default(1),
    })

    const { page } = checkInHistoryQuerySchema.parse(request.query)

    const { checkIns } = await this.checkInsService.fetchUserCheckInsHistory({
      page,
      userId: request.user.sub,
    })

    return reply.status(200).send({ checkIns })
  }

  async checkInsCount(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<checkInsCountResponse> {
    const { checkInsCount } = await this.checkInsService.getUserMetrics({
      userId: request.user.sub,
    })

    return reply.status(200).send({
      checkInsCount,
    })
  }

  async checkInValidate(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<never> {
    const checkInValidateParamsSchema = z.object({
      checkInId: z.string().uuid(),
    })

    const { checkInId } = checkInValidateParamsSchema.parse(request.params)

    this.checkInsService.validadeCheckIn({
      checkInId,
    })

    return reply.status(204).send()
  }
}
