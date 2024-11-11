import { Injectable } from '@angular/core'
import { User } from '../model/user.model'
import { UserRepository } from '../repository/user.repository'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private repository: UserRepository) {}

  getLocalUser(): User {
    const user = this.repository.findLocalUser()

    if (user) {
      return user
    }

    return this.repository.save({ name: 'Anônimo' })
  }
}
