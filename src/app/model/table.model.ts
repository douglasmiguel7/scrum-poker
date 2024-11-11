import { User } from './user.model'

export interface Table {
  name: string
  owner: User
  estimation: number
}
