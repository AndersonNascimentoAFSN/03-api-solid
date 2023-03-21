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

export type SearchGymsRequest = {
  query: string
  page: number
}

export type SearchGymsResponse = {
  gyms: Gym[]
}

export interface InterfaceGymService {
  createGym({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymRequest): Promise<CreateGymResponse>

  searchGyms({ query }: SearchGymsRequest): Promise<SearchGymsResponse>
}
