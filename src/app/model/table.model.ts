import { DocumentReference } from '@angular/fire/firestore'
import { Task } from './task.model'
import { User } from './user.model'

export interface Table {
  id: string
  name: string
  owner: DocumentReference<User>
  tasks: Record<string, Task>
  createdAt: string
  updatedAt: string
}
