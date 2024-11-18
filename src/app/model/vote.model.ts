import { User } from './user.model'

export interface Vote {
  id: string
  value: number
  user: User
  tableId: string
  cardId: string
  createdAt: string
  updatedAt: string
}

export interface VoteValueQuantity {
  value: string
  quantity: number
}
