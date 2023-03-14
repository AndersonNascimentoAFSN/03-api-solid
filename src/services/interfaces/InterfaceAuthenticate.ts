import { User } from '@prisma/client'

export type AuthenticateServiceRequest = {
  email: string
  password: string
}

export type AuthenticateServiceResponse = {
  user: User
}

export interface InterfaceAuthenticateService {
  authenticate({
    email,
    password,
  }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse>
}
