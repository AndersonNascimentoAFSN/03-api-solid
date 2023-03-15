import { Gym } from '@prisma/client'

export interface GymsRepository {
  findGymsById(id: string): Promise<Gym | null>
}
