import { inject, Injectable } from '@angular/core'
import { User } from '../model/user.model'
import { UserRepository } from '../repository/user.repository'
import { DEFAULT_USERNAME } from '../utils/constant'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  repository = inject(UserRepository)

  getMe(): User {
    const user = this.repository.findMe()

    if (user) {
      return user
    }

    return this.repository.save({ name: DEFAULT_USERNAME })
  }
}
