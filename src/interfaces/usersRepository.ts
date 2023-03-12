import { Prisma, User } from '@prisma/client'

type Email = {
  email: string
}

export interface UsersRepository {
  createUsers(data: Prisma.UserCreateInput): Promise<User>
  findUserByEmail({ email }: Email): Promise<User | null>
}
