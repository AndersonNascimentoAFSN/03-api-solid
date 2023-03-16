import { Gym } from '@prisma/client'

export type CreateGymRequest = {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

export type CreateGymResponse = {
  gym: Gym
}

export interface InterfaceGymService {
  createGym({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymRequest): Promise<CreateGymResponse>
}
