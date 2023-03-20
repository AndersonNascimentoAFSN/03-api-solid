import { GymsRepository } from './../repositories/interfaces/gymsRepository'
import { CheckInsRepository } from '@/repositories/prisma/checkInsRepositoryPrisma'

import {
  CheckInServiceRequest,
  CheckInServiceResponse,
  fetchUserCheckInsHistoryRequest,
  fetchUserCheckInsHistoryResponse,
  GetUserMetricsRequest,
  GetUserMetricsResponse,
  InterfaceCheckInService,
} from './interfaces/InterfaceCheckInService'
import { ResourceNotFoundError } from './errors/resourceNotFound'
import { getDistanceBetweenCoordinates } from './utils/getDistanceBetweenCoordinates'
import { MaxDistanceError } from './errors/max-distance.error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

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
    const gym = await this.gymsRepository.findGymById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    // Calculate distance between user and gym
    const distance = getDistanceBetweenCoordinates({
      to: { latitude: userLatitude, longitude: userLongitude },
      from: {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    })

    const MAX_DISTANCE_IN_KILOMETERS = 0.1 // 100 metros

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate({
      userId,
      date: new Date(),
    })

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkIn = await this.checkInRepository.createCheckIn({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }

  async fetchUserCheckInsHistory({
    userId,
    page,
  }: fetchUserCheckInsHistoryRequest): Promise<fetchUserCheckInsHistoryResponse> {
    const checkIns = await this.checkInRepository.findManyCheckInsByUserId({
      userId,
      page,
    })

    return {
      checkIns,
    }
  }

  async getUserMetrics({
    userId,
  }: GetUserMetricsRequest): Promise<GetUserMetricsResponse> {
    const checkInsCount = await this.checkInRepository.countByUserId({
      userId,
    })

    return {
      checkInsCount,
    }
  }
}
