import { Prisma, User } from '@prisma/client'

import { UsersRepository } from '@/repositories/interfaces/usersRepository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async createUsers(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(user)

    return user
  }

  async findUsers() {
    const users = this.items

    return users
  }

  async findUserById(userId: string) {
    const user = this.items.find((item) => item.id === userId)

    if (!user) {
      return null
    }

    return user
  }

  async findUserByEmail({ email }: { email: string }) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }
}
