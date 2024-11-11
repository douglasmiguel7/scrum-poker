import { Injectable } from '@angular/core'
import {
  doc,
  docData,
  DocumentReference,
  Firestore,
  setDoc,
} from '@angular/fire/firestore'
import { traceUntilFirst } from '@angular/fire/performance'
import { Observable } from 'rxjs'
import { User } from '../model/user.model'
import { UserRepository } from '../repository/user.repository'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private ref: DocumentReference | null = null

  constructor(
    private firestore: Firestore,
    private repository: UserRepository,
  ) {}

  getLocalUser(): User {
    const user = this.repository.findLocalUser()

    if (user) {
      return user
    }

    return this.repository.save({ name: 'Anônimo' })
  }

  getUserObservable(): Observable<User> {
    const user = this.getLocalUser()

    this.ref = doc(this.firestore, 'users', user.id)

    setDoc(this.ref, user)

    return docData(this.ref).pipe(traceUntilFirst('firestore'))
  }

  changeName(name: string): void {
    const user = this.getLocalUser()

    const updatedUser: User = {
      ...user,
      name,
    }

    setDoc(this.ref!, updatedUser)

    this.repository.update(updatedUser)
  }
}
