import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'

import { InMemoryGymsRepository } from '@/repositories/in-memory/inMemoryGymsRepository'
import { InMemoryCheckInRepository } from './../repositories/in-memory/inMemoryCheckInsRepository'
import { CheckInService } from './checkInService'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance.error'
import { ResourceNotFoundError } from './errors/resourceNotFound'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInRepository: InMemoryCheckInRepository
let gymsRepository: InMemoryGymsRepository
let checkInService: CheckInService

describe('CheckIn Service', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInService = new CheckInService(checkInRepository, gymsRepository)

    await gymsRepository.createGym({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await checkInService.checkIn({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkIn).toEqual(
      expect.objectContaining({
        gym_id: 'gym-01',
        user_id: 'user-01',
      }),
    )
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await checkInService.checkIn({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    await expect(() =>
      checkInService.checkIn({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await checkInService.checkIn({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await checkInService.checkIn({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkIn).toEqual(
      expect.objectContaining({
        gym_id: 'gym-01',
        user_id: 'user-01',
      }),
    )
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.createGym({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })

    await expect(
      checkInService.checkIn({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })

  it('should be able to fetch check-in history', async () => {
    await checkInRepository.createCheckIn({
      gym_id: 'gym_01',
      user_id: 'user-01',
    })

    await checkInRepository.createCheckIn({
      gym_id: 'gym_02',
      user_id: 'user-01',
    })

    const { checkIns } = await checkInService.fetchUserCheckInsHistory({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym_01' }),
      expect.objectContaining({ gym_id: 'gym_02' }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let index = 1; index <= 22; index += 1) {
      await checkInRepository.createCheckIn({
        gym_id: `gym-${index}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await checkInService.fetchUserCheckInsHistory({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInRepository.createCheckIn({
      gym_id: 'gym_01',
      user_id: 'user-01',
    })

    await checkInRepository.createCheckIn({
      gym_id: 'gym_02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await checkInService.getUserMetrics({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInRepository.createCheckIn({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await checkInService.validadeCheckIn({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      checkInService.validadeCheckIn({
        checkInId: 'inexistent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkInRepository.createCheckIn({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      checkInService.validadeCheckIn({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
