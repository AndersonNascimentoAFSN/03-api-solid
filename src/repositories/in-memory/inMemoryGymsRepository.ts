import { randomUUID } from 'node:crypto'
import { Gym, Prisma } from '@prisma/client'

import { GymsRepository, SearchManyRequest } from '../interfaces/gymsRepository'

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
}
