import { GymsRepositoryPrisma } from '@/repositories/prisma/gymsRepositoryPrisma'
import {
  CreateGymRequest,
  CreateGymResponse,
  InterfaceGymService,
} from './interfaces/InterfaceGymService'

export class GymServices implements InterfaceGymService {
  private gymsRepository: GymsRepositoryPrisma

  constructor(gymsRepository: GymsRepositoryPrisma) {
    this.gymsRepository = gymsRepository
  }

  async createGym({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymRequest): Promise<CreateGymResponse> {
    const gym = await this.gymsRepository.createGym({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return {
      gym,
    }
  }
}
