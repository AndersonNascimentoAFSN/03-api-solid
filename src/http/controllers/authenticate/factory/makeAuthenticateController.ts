import { AuthenticateController } from '../authenticateController'
import { makeAuthenticateService } from '@/services/factories/makeAuthenticateService'

export function makeAuthenticateController() {
  const authenticateService = makeAuthenticateService()
  const authenticateController = new AuthenticateController(authenticateService)
  return authenticateController
}
