import { Injectable } from '@angular/core'
import { NewUser, User } from '../model/user.model'
import { USER_KEY } from '../utils/constant'
import { randomUuid } from '../utils/uuid'

@Injectable({
  providedIn: 'root',
})
export class UserRepository {
  save({ name }: NewUser): User {
    const user: User = {
      id: randomUuid(),
      name,
    }

    localStorage.setItem(USER_KEY, JSON.stringify(user))

    return user
  }

  update(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  findLocalUser(): User | null {
    const user = localStorage.getItem(USER_KEY)

    if (!user) {
      return null
    }

    return JSON.parse(user) as User
  }
}
