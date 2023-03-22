import { Gym, Prisma } from '@prisma/client'

import {
  FindManyNearbyRequest,
  GymsRepository,
  SearchManyRequest,
} from '@/repositories/interfaces/gymsRepository'

import { prisma } from '@/lib/prisma'

export class GymsRepositoryPrisma implements GymsRepository {
  async createGym(data: Prisma.GymCreateInput) {
    const gymCreatedData = await prisma.gym.create({
      data,
    })

    return gymCreatedData
  }

  async findGymById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: { id },
    })

    return gym
  }

  async searchMany({ query, page }: SearchManyRequest): Promise<Gym[]> {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyRequest): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }
}
