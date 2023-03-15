import { CheckIn, Prisma } from '@prisma/client'

export type findByUserIdOnDateRequest = {
  userId: string
  date: Date
}

export interface CheckInsRepositoryInterface {
  createCheckIn(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findByUserIdOnDate({
    userId,
    date,
  }: findByUserIdOnDateRequest): Promise<CheckIn | null>
}
