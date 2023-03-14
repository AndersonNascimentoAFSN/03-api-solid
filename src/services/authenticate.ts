import { User } from '@prisma/client'

import { UsersRepository } from '@/repositories/interfaces/usersRepository'
import { InvalidCredentialsError } from './errors/invalidCredentialsError'
import { compareHashPassword } from '@/utils/compareHashPassword'

interface AuthenticateServiceRequest {
  email: string
  password: string
}

interface AuthenticateServiceRespose {
  user: User
}

export class AuthenticateService {
  private usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async authenticate({
    email,
    password,
  }: AuthenticateServiceRequest): Promise<AuthenticateServiceRespose> {
    const user = await this.usersRepository.findUserByEmail({ email })

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compareHashPassword({
      password,
      hash: user.password_hash,
    })

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}
