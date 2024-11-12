import { Card } from './card.model'
import { User } from './user.model'

export interface Vote {
  id: string
  card: Card
  player: User
  createdAt: string
  updatedAt: string
}
