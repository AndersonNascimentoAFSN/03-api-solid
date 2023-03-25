import { UsersController } from '../usersController'
import { makeUsersService } from '@/services/factories/makeUsersService'

export function makeUsersController() {
  const usersService = makeUsersService()
  const usersController = new UsersController(usersService)
  return usersController
}
