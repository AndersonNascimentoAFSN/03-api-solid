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

  async checkin({
    userId,
    gymId,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const checkIn = await this.checkInRepository.createCheckIn({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }
}
