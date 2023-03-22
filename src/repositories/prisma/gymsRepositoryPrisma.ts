import {
  FindManyNearbyRequest,
  GymsRepository,
  SearchManyRequest,
} from '@/repositories/interfaces/gymsRepository'
import { prisma } from '@/lib/prisma'
import { Gym, Prisma } from '@prisma/client'

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
    throw new Error('Not implemented')
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyRequest): Promise<Gym[]> {
    throw new Error('Not implemented')
  }
}
