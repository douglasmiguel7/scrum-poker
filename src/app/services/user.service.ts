import { Injectable } from '@angular/core'
import {
  doc,
  docData,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore'
import { traceUntilFirst } from '@angular/fire/performance'
import { Observable } from 'rxjs'
import { User } from '../model/user.model'
import { getCurrentDate } from '../utils/date'
import { getUserId } from '../utils/user'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private ref: DocumentReference<User>
  private id: string

  constructor(private firestore: Firestore) {
    this.id = getUserId()
    this.ref = doc(this.firestore, 'users', this.id) as DocumentReference<User>
  }

  getRef(): DocumentReference<User> {
    return this.ref
  }

  async getUserObservable(): Promise<Observable<User>> {
    const doc = await getDoc(this.ref)

    const exists = doc.exists()
    if (!exists) {
      const now = getCurrentDate()

      const user: User = {
        id: this.id,
        name: 'Anônimo',
        createdAt: now,
        updatedAt: now,
      }

      await setDoc(this.ref, user)
    }

    return docData(this.ref).pipe(traceUntilFirst('firestore'))
  }

  async changeName(name: string): Promise<void> {
    const user: Partial<User> = {
      name,
      updatedAt: getCurrentDate(),
    }

    updateDoc(this.ref, user)
  }
}
