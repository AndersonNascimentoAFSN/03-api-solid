import { CheckIn } from '@prisma/client'

export type CheckInHistoryResponse = {
  checkIns: CheckIn[]
}
