import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { CheckInsRepositoryInterface } from '../interfaces/checkInsRepository'

export class CheckInsRepository implements CheckInsRepositoryInterface {
  async createCheckIn(data: Prisma.CheckInUncheckedCreateInput) {
    const checkInCreatedData = await prisma.checkIn.create({
      data,
    })

    return checkInCreatedData
  }
}
