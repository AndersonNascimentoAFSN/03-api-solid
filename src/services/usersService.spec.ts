import { describe, it, expect, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'

import { UserAlreadyExistsError } from './errors/userAlreadyExistsEmailError'

import { UsersServices } from './usersServices'
import { InMemoryUsersRepository } from '@/repositories/in-memory/inMemoryUsersRepository'

let usersRepository: InMemoryUsersRepository
let userService: UsersServices

describe('Register User Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    userService = new UsersServices(usersRepository)
  })

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
})

describe('List User Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    userService = new UsersServices(usersRepository)
  })

  it('should be list users', async () => {
    await userService.createUsers({
      name: 'Yanni Nascimento',
      email: 'yanni.nascimento@meta.com.br',
      password: 'Senha@123',
    })

    const { users } = await userService.GetUsersProfiles()

    expect(users[0]).toEqual(
      expect.objectContaining({
        name: 'Yanni Nascimento',
        email: 'yanni.nascimento@meta.com.br',
      }),
    )
  })

  it('should be list empty', async () => {
    const { users } = await userService.GetUsersProfiles()

    expect(users).toStrictEqual([])
  })
})
