import { CheckIn, Prisma } from '@prisma/client'

export type findByUserIdOnDateRequest = {
  userId: string
  date: Date
}

export type findManyCheckInsByUserIdRequest = {
  userId: string
}

export interface CheckInsRepositoryInterface {
  createCheckIn(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>

  findManyCheckInsByUserId({
    userId,
  }: findManyCheckInsByUserIdRequest): Promise<CheckIn[]>

  findByUserIdOnDate({
    userId,
    date,
  }: findByUserIdOnDateRequest): Promise<CheckIn | null>
}
