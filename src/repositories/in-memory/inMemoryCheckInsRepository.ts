import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'
import {
  CheckInsRepositoryInterface,
  FindManyCheckInsByUserIdRequest,
  FindByUserIdOnDateRequest,
  CountByUserIdRequest,
  FindByIdRequest,
  SaveCheckInRequest,
} from '../interfaces/checkInsRepository'

export class InMemoryCheckInRepository implements CheckInsRepositoryInterface {
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
  }: FindByUserIdOnDateRequest): Promise<CheckIn | null> {
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

  async findManyCheckInsByUserId({
    userId,
    page,
  }: FindManyCheckInsByUserIdRequest): Promise<CheckIn[]> {
    return this.items
      .filter((item) => (item.user_id = userId))
      .slice((page - 1) * 20, page * 20)
  }

  async countByUserId({ userId }: CountByUserIdRequest) {
    return this.items.filter((item) => (item.user_id = userId)).length
  }

  async findById({ checkInId }: FindByIdRequest) {
    const checkIn = this.items.find((item) => (item.id = checkInId))

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async saveCheckIn({ checkIn }: SaveCheckInRequest) {
    const checkIndex = this.items.findIndex((item) => item.id === checkIn.id)

    if (checkIndex >= 0) {
      this.items[checkIndex] = checkIn
    }

    return checkIn
  }
}
