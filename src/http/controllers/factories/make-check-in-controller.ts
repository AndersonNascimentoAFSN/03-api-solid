import { CheckInsController } from '../check-in-controller'
import { makeCheckInService } from '@/services/factories/make-check-in-service'

export function makeCheckInController() {
  const checkInService = makeCheckInService()
  const checkInController = new CheckInsController(checkInService)
  return checkInController
}
