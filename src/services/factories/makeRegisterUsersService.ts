import { RegisterUsersServices } from '../registerUsersServices'
import { UsersRepositoryPrisma } from '../../repositories/prisma/usersRepositoryPrisma'

export function makeRegisterUsersService() {
  const usersRepository = new UsersRepositoryPrisma()
  const usersServices = new RegisterUsersServices(usersRepository)
  return usersServices
}
