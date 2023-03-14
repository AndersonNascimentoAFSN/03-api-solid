import { User } from '@prisma/client'

export type CreateUsersRequest = {
  name: string
  email: string
  password: string
}

export type CreateUsersResponse = {
  user: User
}

export type GetUserProfileRequest = {
  userId: string
}

export type GetUserProfileResponse = {
  user: User
}

export type GetUsersProfilesResponse = {
  users: User[]
}

export interface InterfaceUsersService {
  createUsers({
    name,
    email,
    password,
  }: CreateUsersRequest): Promise<CreateUsersResponse>
  getUserProfile({
    userId,
  }: GetUserProfileRequest): Promise<GetUserProfileResponse>
  getUsersProfiles(): Promise<GetUsersProfilesResponse>
}
