import { randomUUID } from 'node:crypto'
import { Gym, Prisma } from '@prisma/client'

import {
  FindManyNearbyRequest,
  GymsRepository,
  SearchManyRequest,
} from '../interfaces/gymsRepository'
import { getDistanceBetweenCoordinates } from '@/services/utils/getDistanceBetweenCoordinates'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findGymById(id: string) {
    const gym = this.items.find((item) => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async createGym(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }

  async searchMany({ query, page }: SearchManyRequest) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyRequest) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates({
        to: {
          latitude,
          longitude,
        },
        from: {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      })
      return distance < 10
    })
  }
}
