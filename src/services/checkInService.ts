import { GymsRepository } from './../repositories/interfaces/gymsRepository'
import { CheckInsRepository } from '@/repositories/prisma/checkInsRepositoryPrisma'

import {
  CheckInServiceRequest,
  CheckInServiceResponse,
  InterfaceCheckInService,
} from './interfaces/InterfaceCheckInService'
import { ResourceNotFoundError } from './errors/resourceNotFound'

export class CheckInService implements InterfaceCheckInService {
  private checkInRepository: CheckInsRepository
  private gymsRepository: GymsRepository

  constructor(
    checkInRepository: CheckInsRepository,
    gymsRepository: GymsRepository,
  ) {
    this.checkInRepository = checkInRepository
    this.gymsRepository = gymsRepository
  }

  async checkIn({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const gym = await this.gymsRepository.findGymsById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    // Calculate distance between user and gym

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
