import { User } from '@prisma/client'

import { UsersRepository } from '@/interfaces/usersRepository'
import { createHashPassword } from '@/utils/createHashPassword'
import { UserAlreadyExistsError } from './errors/userAlreadyExistsEmailError'

interface UsersServicesParams {
  name: string
  email: string
  password: string
}

interface UsersServicesResponse {
  user: User
}

export class UsersServices {
  // SOLID
  // D - Dependency Inversion Principle

  private usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async createUsers({
    name,
    email,
    password,
  }: UsersServicesParams): Promise<UsersServicesResponse> {
    const password_hash = await createHashPassword(password)

    const userWithSameEmail = await this.usersRepository.findUserByEmail({
      email,
    })

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const userCreated = await this.usersRepository.createUsers({
      name,
      email,
      password_hash,
    })

    return { user: userCreated }
  }
}
