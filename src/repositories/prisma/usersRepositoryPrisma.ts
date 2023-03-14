import { UsersRepository } from '@/repositories/interfaces/usersRepository'
import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'

export class UsersRepositoryPrisma implements UsersRepository {
  async createUsers(data: Prisma.UserCreateInput) {
    const userCreatedData = await prisma.user.create({
      data,
    })

    return userCreatedData
  }

  async findUsers(): Promise<User[]> {
    const users = await prisma.user.findMany()

    return users
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    return user
  }

  async findUserByEmail({ email }: { email: string }): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }
}
