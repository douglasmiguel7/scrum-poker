import { DocumentReference } from '@angular/fire/firestore'
import { Task } from './task.model'
import { User } from './user.model'
import { UserRole } from './user-role.model'

export interface Table {
  id: string
  name: string
  open: boolean
  owner: DocumentReference<User>
  tasks: Record<string, Task>
  userRole: Record<string, UserRole>
  players: DocumentReference<User>[]
  spectators: DocumentReference<User>[]
  createdAt: string
  updatedAt: string
}
