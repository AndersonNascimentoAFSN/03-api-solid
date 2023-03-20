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

export type fetchUserCheckInsHistoryRequest = {
  userId: string
  page: number
}

export type fetchUserCheckInsHistoryResponse = {
  checkIns: CheckIn[]
}

export type GetUserMetricsRequest = {
  userId: string
}

export type GetUserMetricsResponse = {
  checkInsCount: number
}

export interface InterfaceCheckInService {
  checkIn({
    userId,
    gymId,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse>

  fetchUserCheckInsHistory({
    userId,
    page,
  }: fetchUserCheckInsHistoryRequest): Promise<fetchUserCheckInsHistoryResponse>

  getUserMetrics({
    userId,
  }: GetUserMetricsRequest): Promise<GetUserMetricsResponse>
}
