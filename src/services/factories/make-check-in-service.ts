import { CheckInService } from '../checkInService'
import { CheckInsRepository } from '../../repositories/prisma/checkInsRepositoryPrisma'
import { GymsRepositoryPrisma } from '../../repositories/prisma/gymsRepositoryPrisma'

export function makeCheckInService() {
  const checkInRepository = new CheckInsRepository()
  const gymsRepository = new GymsRepositoryPrisma()
  const checkInService = new CheckInService(checkInRepository, gymsRepository)
  return checkInService
}
