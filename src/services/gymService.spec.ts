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
})
