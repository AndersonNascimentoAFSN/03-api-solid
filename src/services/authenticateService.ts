import { UsersRepository } from '@/repositories/interfaces/usersRepository'
import { InvalidCredentialsError } from './errors/invalidCredentialsError'
import { compareHashPassword } from '@/utils/compareHashPassword'
import {
  AuthenticateServiceRequest,
  AuthenticateServiceResponse,
  InterfaceAuthenticateService,
} from './interfaces/InterfaceAuthenticate'

export class AuthenticateService implements InterfaceAuthenticateService {
  private usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async authenticate({
    email,
    password,
  }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
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
