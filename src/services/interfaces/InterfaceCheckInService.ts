import { CheckIn } from '@prisma/client'

export type CheckInServiceRequest = {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
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
