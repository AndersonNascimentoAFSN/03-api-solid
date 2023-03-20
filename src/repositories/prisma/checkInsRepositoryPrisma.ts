import { prisma } from '@/lib/prisma'
import { CheckIn, Prisma } from '@prisma/client'

import {
  CheckInsRepositoryInterface,
  CountByUserIdRequest,
  FindByUserIdOnDateRequest,
  FindManyCheckInsByUserIdRequest,
} from '../interfaces/checkInsRepository'

export class CheckInsRepository implements CheckInsRepositoryInterface {
  async createCheckIn(data: Prisma.CheckInUncheckedCreateInput) {
    const checkInCreatedData = await prisma.checkIn.create({
      data,
    })

    return checkInCreatedData
  }

  async findByUserIdOnDate({
    userId,
    date,
  }: FindByUserIdOnDateRequest): Promise<CheckIn | null> {}

  async findManyCheckInsByUserId({
    userId,
    page,
  }: FindManyCheckInsByUserIdRequest): Promise<CheckIn[]> {}

  async countByUserId({ userId }: CountByUserIdRequest): Promise<number> {}
}
