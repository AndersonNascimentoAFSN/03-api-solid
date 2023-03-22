import { GymServices } from '../gymService'
import { GymsRepositoryPrisma } from '../../repositories/prisma/gymsRepositoryPrisma'

export function makeGymService() {
  const gymsRepository = new GymsRepositoryPrisma()
  const gymService = new GymServices(gymsRepository)
  return gymService
}
