import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'
import { findByUserIdOnDateRequest } from '../interfaces/checkInsRepository'

import { CheckInsRepository } from '../prisma/checkInsRepositoryPrisma'

export class InMemoryCheckInRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async createCheckIn(data: Prisma.CheckInUncheckedCreateInput) {
    const CheckIn = {
      id: randomUUID(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }

    this.items.push(CheckIn)

    return CheckIn
  }

  async findByUserIdOnDate({
    userId,
    date,
  }: findByUserIdOnDateRequest): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const CheckOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!CheckOnSameDate) {
      return null
    }

    return CheckOnSameDate
  }
}
