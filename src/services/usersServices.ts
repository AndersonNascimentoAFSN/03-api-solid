import { UsersRepository } from '@/repositories/usersRepository'
import { hash } from 'bcryptjs'

interface UsersServicesParams {
  name: string
  email: string
  password: string
}

export async function usersServices({
  name,
  email,
  password,
}: UsersServicesParams) {
  const usersRepository = new UsersRepository()

  const password_hash = await hash(password, 6)

  const userWithSameEmail = await usersRepository.findUserByEmail({ email })

  if (userWithSameEmail) {
    throw new Error('E-mail already exists')
  }

  await usersRepository.createUsers({
    name,
    email,
    password_hash,
  })
}
