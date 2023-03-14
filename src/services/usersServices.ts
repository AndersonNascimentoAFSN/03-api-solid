import { UsersRepository } from '@/repositories/interfaces/usersRepository'
import { createHashPassword } from '@/utils/createHashPassword'
import { UserAlreadyExistsError } from './errors/userAlreadyExistsEmailError'
import { ResourceNotFoundError } from './errors/resourceNotFound'
import {
  CreateUsersRequest,
  CreateUsersResponse,
  GetUserProfileRequest,
  GetUserProfileResponse,
  GetUsersProfilesResponse,
  InterfaceUsersService,
} from './interfaces/InterfaceUsersService'

export class UsersServices implements InterfaceUsersService {
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
  }: CreateUsersRequest): Promise<CreateUsersResponse> {
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

  async getUsersProfiles(): Promise<GetUsersProfilesResponse> {
    const users = await this.usersRepository.findUsers()

    return { users }
  }

  async getUserProfile({
    userId,
  }: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    const user = await this.usersRepository.findUserById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
