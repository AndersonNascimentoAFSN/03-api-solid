import { CheckInsRepository } from '@/repositories/prisma/checkInsRepositoryPrisma'

import {
  CheckInServiceRequest,
  CheckInServiceResponse,
  InterfaceCheckInService,
} from './interfaces/InterfaceCheckInService'

export class CheckInService implements InterfaceCheckInService {
  private checkInRepository: CheckInsRepository

  constructor(checkInRepository: CheckInsRepository) {
    this.checkInRepository = checkInRepository
  }

  async checkIn({
    userId,
    gymId,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate({
      userId,
      date: new Date(),
    })

    if (checkInOnSameDay) {
      throw new Error()
    }

    const checkIn = await this.checkInRepository.createCheckIn({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }
}
