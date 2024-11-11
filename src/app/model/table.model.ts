import { User } from './user.model'

export interface NewTable {
  name: string
  owner: User
}

export interface Table {
  id: string
  name: string
  owner: User
}
