import { createHashPassword } from '../utils/createHashPassword'

import { InMemoryUsersRepository } from '@/repositories/in-memory/inMemoryUsersRepository'
import { describe, it, expect, beforeEach } from 'vitest'
import { AuthenticateService } from './authenticate'
import { InvalidCredentialsError } from './errors/invalidCredentialsError'

let usersRepository: InMemoryUsersRepository
let authenticateService: AuthenticateService

describe('Authenticate Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateService = new AuthenticateService(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.createUsers({
      name: 'Yanni Nascimento',
      email: 'yanni.nascimento@meta.com.br',
      password_hash: await createHashPassword('Senha@123'),
    })

    const { user } = await authenticateService.authenticate({
      email: 'yanni.nascimento@meta.com.br',
      password: 'Senha@123',
    })

    expect(user).toEqual(
      expect.objectContaining({
        name: 'Yanni Nascimento',
        email: 'yanni.nascimento@meta.com.br',
      }),
    )
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      authenticateService.authenticate({
        email: 'yanni.nascimento@meta.com.br',
        password: 'Senha@123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.createUsers({
      name: 'Yanni Nascimento',
      email: 'yanni.nascimento@meta.com.br',
      password_hash: await createHashPassword('Senha@123'),
    })

    await expect(() =>
      authenticateService.authenticate({
        email: 'yanni.nascimento@meta.com.br',
        password: 'Senha@122',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
