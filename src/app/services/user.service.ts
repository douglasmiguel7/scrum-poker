import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { User } from '../model/user.model'
import { getCurrentDate } from '../utils/date'
import { getUserId } from '../utils/id'
import { FirestoreService } from './firestore.service'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestoreService: FirestoreService) {}

  async create(): Promise<void> {
    const id = getUserId()

    const exists = await this.firestoreService.exists('users', id)
    if (exists) {
      return
    }

    const now = getCurrentDate()

    const user: User = {
      id,
      name: 'Anônimo',
      createdAt: now,
      updatedAt: now,
    }

    this.firestoreService.save('users', id, user)
  }

  getUserObservable(): Observable<User> {
    return this.firestoreService.getDocumentObservable('users', getUserId())
  }

  async changeName(name: string): Promise<void> {
    this.firestoreService.update('users', getUserId(), { name })
  }
}
