import { Gym, Prisma } from '@prisma/client'

export interface GymsRepository {
  findGymById(id: string): Promise<Gym | null>
  createGym(data: Prisma.GymCreateInput): Promise<Gym>
}
