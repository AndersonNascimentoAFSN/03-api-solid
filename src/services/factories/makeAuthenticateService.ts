import { UsersRepositoryPrisma } from '../../repositories/prisma/usersRepositoryPrisma'
import { AuthenticateService } from '../authenticate'

export function makeAuthenticateService() {
  const usersRepository = new UsersRepositoryPrisma()
  const authenticateService = new AuthenticateService(usersRepository)
  return authenticateService
}
