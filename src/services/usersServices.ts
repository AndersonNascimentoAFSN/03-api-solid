import { User } from '@prisma/client'

import { UsersRepository } from '@/repositories/interfaces/usersRepository'
import { createHashPassword } from '@/utils/createHashPassword'
import { UserAlreadyExistsError } from './errors/userAlreadyExistsEmailError'
import { ResourceNotFoundError } from './errors/resourceNotFound'

interface CreateUsersRequest {
  name: string
  email: string
  password: string
}

interface CreateUsersResponse {
  user: User
}

interface GetUserProfileRequest {
  userId: string
}

interface GetUserProfileResponse {
  user: User
}

interface GetUsersProfilesResponse {
  users: User[]
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

  async GetUsersProfiles(): Promise<GetUsersProfilesResponse> {
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
