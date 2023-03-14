import { Prisma, User } from '@prisma/client'

type Email = {
  email: string
}

export interface UsersRepository {
  createUsers(data: Prisma.UserCreateInput): Promise<User>
  findUsers(): Promise<User[] | []>
  findUserById(id: string): Promise<User | null>
  findUserByEmail({ email }: Email): Promise<User | null>
}
