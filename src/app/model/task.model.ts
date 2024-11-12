import { Vote } from './vote.model'

export interface Task {
  id: string
  title: string
  link: string
  estimation: number
  selected: boolean
  voted: boolean
  votes: Record<string, Vote>
  createdAt: string
  updatedAt: string
}
