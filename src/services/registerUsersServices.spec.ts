import { InMemoryUsersRepository } from '@/repositories/in-memory/inMemoryUsersRepository'
import { compare } from 'bcryptjs'
import { describe, it, expect } from 'vitest'
import { UserAlreadyExistsError } from './errors/userAlreadyExistsEmailError'

import { UsersServices } from './usersServices'

describe('Register User Service', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUserService = new UsersServices(usersRepository)

    const { user } = await registerUserService.createUsers({
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
    const usersRepository = new InMemoryUsersRepository()
    const registerUserService = new UsersServices(usersRepository)

    const { user } = await registerUserService.createUsers({
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
    const usersRepository = new InMemoryUsersRepository()
    const registerUserService = new UsersServices(usersRepository)

    const email = 'johndoe@example.com'

    await registerUserService.createUsers({
      name: 'Yanni Nascimento',
      email,
      password: 'Senha@123',
    })

    await expect(() =>
      registerUserService.createUsers({
        name: 'Yanni Nascimento',
        email,
        password: 'Senha@123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
