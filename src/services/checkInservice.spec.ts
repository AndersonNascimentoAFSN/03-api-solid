import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import { InMemoryCheckInRepository } from './../repositories/in-memory/inMemoryCheckInsRepository'

import { CheckInService } from './checkInService'

let checkInRepository: InMemoryCheckInRepository
let checkInService: CheckInService

describe('CheckIn Service', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    checkInService = new CheckInService(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await checkInService.checkIn({
      gymId: 'gym-01',
      userId: 'user-01',
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
    })

    await expect(() =>
      checkInService.checkIn({
        gymId: 'gym-01',
        userId: 'user-01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await checkInService.checkIn({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await checkInService.checkIn({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn).toEqual(
      expect.objectContaining({
        gym_id: 'gym-01',
        user_id: 'user-01',
      }),
    )
  })
})
