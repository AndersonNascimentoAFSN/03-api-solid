import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class UsersRepositoryPrisma {
  async createUsers(data: Prisma.UserCreateInput) {
    const userCreatedData = await prisma.user.create({
      data,
    })

    return userCreatedData
  }

  async findUserByEmail({ email }: { email: string }) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }
}
