import { CheckIn } from '@prisma/client'

export type CheckInServiceRequest = {
  userId: string
  gymId: string
}

export type CheckInServiceResponse = {
  checkIn: CheckIn
}

export interface InterfaceCheckInService {
  checkIn({
    userId,
    gymId,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse>
}
