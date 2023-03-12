import { UsersRepository } from '@/interfaces/usersRepository'
import { createHashPassword } from '@/utils/createHashPassword'

interface UsersServicesParams {
  name: string
  email: string
  password: string
}

export class UsersServices {
  // SOLID
  // D - Dependency Inversion Principle

  private usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async createUsers({ name, email, password }: UsersServicesParams) {
    const password_hash = await createHashPassword(password)

    const userWithSameEmail = await this.usersRepository.findUserByEmail({
      email,
    })

    if (userWithSameEmail) {
      throw new Error('E-mail already exists')
    }

    await this.usersRepository.createUsers({
      name,
      email,
      password_hash,
    })
  }
}
