import { Prisma, User } from '@prisma/client'

import { UsersRepository } from '@/repositories/interfaces/usersRepository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async createUsers(data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-1',
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
    const users = [
      {
        id: 'user-1',
        name: 'Jhon Duo',
        email: 'john.duo@email.com',
        password_hash: 'dakjsdkljaklsjld',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'user-2',
        name: 'Jhon Snow',
        email: 'john.Snow@email.com',
        password_hash: 'dakjsdkljaklsjld',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]

    return users
  }

  async findUserByEmail({ email }: { email: string }) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }
}
