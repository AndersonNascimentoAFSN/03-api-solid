import { UsersServices } from '../usersServices'
import { UsersRepositoryPrisma } from '../../repositories/prisma/usersRepositoryPrisma'

export function makeUsersService() {
  const usersRepository = new UsersRepositoryPrisma()
  const usersServices = new UsersServices(usersRepository)
  return usersServices
}
