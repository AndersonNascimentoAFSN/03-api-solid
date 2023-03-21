import { GymsRepositoryPrisma } from '@/repositories/prisma/gymsRepositoryPrisma'
import {
  CreateGymRequest,
  CreateGymResponse,
  FetchNearbyGymsRequest,
  FetchNearbyGymsResponse,
  InterfaceGymService,
  SearchGymsRequest,
  SearchGymsResponse,
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

  async searchGyms({
    query,
    page,
  }: SearchGymsRequest): Promise<SearchGymsResponse> {
    const gyms = await this.gymsRepository.searchMany({ query, page })

    return {
      gyms,
    }
  }

  async fetchNearbyGyms({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsRequest): Promise<FetchNearbyGymsResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return {
      gyms,
    }
  }
}
