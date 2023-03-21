import { Gym, Prisma } from '@prisma/client'

export type SearchManyRequest = {
  query: string
  page: number
}

export interface GymsRepository {
  findGymById(id: string): Promise<Gym | null>
  createGym(data: Prisma.GymCreateInput): Promise<Gym>
  searchMany({ query, page }: SearchManyRequest): Promise<Gym[]>
}
