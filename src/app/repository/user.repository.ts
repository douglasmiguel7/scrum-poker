import { Injectable } from '@angular/core'
import { NewUser, User } from '../model/user.model'
import {
  DEFAULT_USERNAME,
  USER_ID_KEY,
  USER_NAME_KEY as USERNAME_KEY,
} from '../utils/constant'
import { randomUuid, validateUuid } from '../utils/uuid'

@Injectable({
  providedIn: 'root',
})
export class UserRepository {
  save({ name }: NewUser): User {
    const id = randomUuid()

    localStorage.setItem(USER_ID_KEY, id)
    localStorage.setItem(USERNAME_KEY, name)

    return { id, name }
  }

  findMe(): User | null {
    const id = localStorage.getItem(USER_ID_KEY) as string

    const valid = validateUuid(id)

    if (!valid) {
      return null
    }

    const name = localStorage.getItem(USERNAME_KEY) || DEFAULT_USERNAME

    return { id, name }
  }
}
