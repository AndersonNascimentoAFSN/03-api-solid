import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/inMemoryGymsRepository'
import { GymServices } from './gymService'

let gymsRepository: InMemoryGymsRepository
let gymsService: GymServices

describe('gym Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    gymsService = new GymServices(gymsRepository)
  })

  // create gym

  it('should be able to create gym', async () => {
    const { gym } = await gymsService.createGym({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    expect(gym).toEqual(
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    )
    // expect(user.id).toEqual(expect.any(String))
  })

  // list gym by id

  it('should be able to search for gyms', async () => {
    await gymsService.createGym({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    await gymsService.createGym({
      title: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    const { gyms } = await gymsService.searchGyms({
      query: 'JavaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)

    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })

  it('should be able to search paginated for gyms', async () => {
    for (let index = 1; index <= 22; index += 1) {
      await gymsService.createGym({
        title: `JavaScript Gym-${index}`,
        description: null,
        phone: null,
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
    }

    const { gyms } = await gymsService.searchGyms({
      query: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)

    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym-21',
      }),
      expect.objectContaining({
        title: 'JavaScript Gym-22',
      }),
    ])
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsService.createGym({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    await gymsService.createGym({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -27.0610928,
      longitude: -49.5229501,
    })

    const { gyms } = await gymsService.fetchNearbyGyms({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(gyms).toHaveLength(1)

    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ])
  })
})
