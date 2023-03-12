import { hash } from 'bcryptjs'

interface UsersServicesParams {
  name: string
  email: string
  password: string
}

export class UsersServices {
  // SOLID
  // D - Dependency Inversion Principle

  private usersRepository: any

  constructor(usersRepository: any) {
    this.usersRepository = usersRepository
  }

  async createUsers({ name, email, password }: UsersServicesParams) {
    const password_hash = await hash(password, 6)

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
