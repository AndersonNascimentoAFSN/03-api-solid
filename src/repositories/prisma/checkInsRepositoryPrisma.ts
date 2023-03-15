import { prisma } from '@/lib/prisma'
import { CheckIn, Prisma } from '@prisma/client'

import {
  CheckInsRepositoryInterface,
  findByUserIdOnDateRequest,
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
  }: findByUserIdOnDateRequest): Promise<CheckIn | null> {}
}
