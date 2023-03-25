import { GymController } from '../gyms/gym-controller'
import { makeGymService } from '@/services/factories/make-gym-service'

export function makeGymController() {
  const gymService = makeGymService()
  const gymController = new GymController(gymService)
  return gymController
}
