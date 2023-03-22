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
  ValidateCheckInRequest,
  ValidateCheckInResponse,
} from './interfaces/InterfaceCheckInService'
import { ResourceNotFoundError } from './errors/resourceNotFound'
import { getDistanceBetweenCoordinates } from './utils/getDistanceBetweenCoordinates'
import { MaxDistanceError } from './errors/max-distance.error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

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

  async validadeCheckIn({
    checkInId,
  }: ValidateCheckInRequest): Promise<ValidateCheckInResponse> {
    const checkIn = await this.checkInRepository.findById({ checkInId })

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInRepository.saveCheckIn({ checkIn })

    return {
      checkIn,
    }
  }
}
