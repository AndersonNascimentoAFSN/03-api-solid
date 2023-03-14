import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepositoryInterface {
  createCheckIn(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}
