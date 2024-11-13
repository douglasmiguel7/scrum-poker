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
  private ref: DocumentReference
  private id: string

  constructor(private firestore: Firestore) {
    this.id = getUserId()
    this.ref = doc(this.firestore, 'users', this.id)
  }

  getRef(): DocumentReference<User> {
    return this.ref as DocumentReference<User>
  }

  getUserObservableByRef(ref: DocumentReference<User>): Observable<User> {
    return docData<User>(ref).pipe(traceUntilFirst('firestore'))
  }

  getUserObservable(): Observable<User> {
    return new Observable((subscriber) => {
      getDoc(this.ref).then((doc) => {
        if (doc.exists()) {
          docData(this.ref)
            .pipe(traceUntilFirst('firestore'))
            .subscribe((user: User) => subscriber.next(user))
          return
        }

        const now = getCurrentDate()

        const user: User = {
          id: this.id,
          name: 'Anônimo',
          createdAt: now,
          updatedAt: now,
        }

        setDoc(this.ref, user)

        subscriber.next(user)
      })
    })
  }

  async changeName(name: string): Promise<void> {
    const user: Partial<User> = {
      name,
      updatedAt: getCurrentDate(),
    }

    updateDoc(this.ref, user)
  }
}
