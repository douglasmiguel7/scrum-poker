import { DocumentReference } from '@angular/fire/firestore'
import { User } from './user.model'

export interface Table {
  id: string
  name: string
  owner: DocumentReference<User>
}
