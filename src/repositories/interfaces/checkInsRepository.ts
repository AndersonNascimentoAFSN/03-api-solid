import { CheckIn, Prisma } from '@prisma/client'

export type FindByUserIdOnDateRequest = {
  userId: string
  date: Date
}

export type FindManyCheckInsByUserIdRequest = {
  userId: string
  page: number
}

export type CountByUserIdRequest = {
  userId: string
}

export interface CheckInsRepositoryInterface {
  createCheckIn(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>

  findManyCheckInsByUserId({
    userId,
    page,
  }: FindManyCheckInsByUserIdRequest): Promise<CheckIn[]>

  findByUserIdOnDate({
    userId,
    date,
  }: FindByUserIdOnDateRequest): Promise<CheckIn | null>

  countByUserId({ userId }: CountByUserIdRequest): Promise<number>
}
