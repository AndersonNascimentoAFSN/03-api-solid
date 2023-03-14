import { describe, it, expect, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'

import { UserAlreadyExistsError } from './errors/userAlreadyExistsEmailError'
import { ResourceNotFoundError } from './errors/resourceNotFound'

import { UsersServices } from './usersServices'
import { InMemoryUsersRepository } from '@/repositories/in-memory/inMemoryUsersRepository'

let usersRepository: InMemoryUsersRepository
let userService: UsersServices

describe('user Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    userService = new UsersServices(usersRepository)
  })

  // create user

  it('should be able to register', async () => {
    const { user } = await userService.createUsers({
      name: 'Yanni Nascimento',
      email: 'yanni.nascimento@meta.com.br',
      password: 'Senha@123',
    })

    expect(user).toEqual(
      expect.objectContaining({
        name: 'Yanni Nascimento',
        email: 'yanni.nascimento@meta.com.br',
      }),
    )
    // expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await userService.createUsers({
      name: 'Yanni Nascimento',
      email: 'yanni.nascimento@meta.com.br',
      password: 'Senha@123',
    })

    const isPasswordCorrectlyHashed = await compare(
      'Senha@123',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await userService.createUsers({
      name: 'Yanni Nascimento',
      email,
      password: 'Senha@123',
    })

    await expect(() =>
      userService.createUsers({
        name: 'Yanni Nascimento',
        email,
        password: 'Senha@123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  // list all users

  it('should be list users', async () => {
    await userService.createUsers({
      name: 'Yanni Nascimento',
      email: 'yanni.nascimento@meta.com.br',
      password: 'Senha@123',
    })

    const { users } = await userService.getUsersProfiles()

    expect(users[0]).toEqual(
      expect.objectContaining({
        name: 'Yanni Nascimento',
        email: 'yanni.nascimento@meta.com.br',
      }),
    )
  })

  it('should be list empty', async () => {
    const { users } = await userService.getUsersProfiles()

    expect(users).toStrictEqual([])
  })

  // list user by id
  it('should be get user profile ', async () => {
    const createdUser = await userService.createUsers({
      name: 'Yanni Nascimento',
      email: 'yanni.nascimento@meta.com.br',
      password: 'Senha@123',
    })

    const { user } = await userService.getUserProfile({
      userId: createdUser.user.id,
    })

    expect(user).toEqual(
      expect.objectContaining({
        id: createdUser.user.id,
        name: 'Yanni Nascimento',
        email: 'yanni.nascimento@meta.com.br',
      }),
    )
  })

  it('should not be able to get user profile with wrong id', async () => {
    await userService.createUsers({
      name: 'Yanni Nascimento',
      email: 'yanni.nascimento@meta.com.br',
      password: 'Senha@123',
    })

    await expect(() =>
      userService.getUserProfile({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
