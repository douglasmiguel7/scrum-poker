import { Injectable } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { UserRole } from '../model/user-role.model'
import { getCurrentDate } from '../utils/date'
import { getTableId } from '../utils/table'
import { getUserId } from '../utils/user'
import { FirestoreService } from './firestore.service'
import { PlayerService } from './player.service'
import { SpectatorService } from './spectator.service'

@Injectable({
  providedIn: 'root',
})
export class UserRoleService {
  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private spectatorService: SpectatorService,
    private playerService: PlayerService,
  ) {}

  async create(): Promise<void> {
    const tableId = getTableId(this.route)
    const userId = getUserId()

    const id = `${tableId}-${userId}`

    const exists = await this.firestoreService.exists('userRoles', id)
    if (exists) {
      return
    }

    const userRole: UserRole = {
      role: 'spectator',
    }

    this.firestoreService.save('userRoles', id, userRole)
  }

  getUserRoleObservable(): Observable<UserRole> {
    const tableId = getTableId(this.route)
    const userId = getUserId()

    const id = `${tableId}-${userId}`

    return this.firestoreService.getDocumentObservable('userRoles', id)
  }

  async switchRole(): Promise<void> {
    const tableId = getTableId(this.route)
    const userId = getUserId()

    const id = `${tableId}-${userId}`

    const snapshot = await this.firestoreService.getDocumentSnapshot<UserRole>(
      'userRoles',
      id,
    )

    const role = snapshot.data()?.role
    if (!role) {
      console.log(getCurrentDate(), `switch role -> role not found in "${id}"`)
      return
    }

    if (role === 'player') {
      console.log(
        getCurrentDate(),
        `switch role -> switching role to "spectator" in "${id}"`,
      )

      this.firestoreService.updateAttirbute<UserRole>('userRoles', id, {
        role: 'spectator',
      })

      this.playerService.delete()
      this.spectatorService.create()

      return
    }

    if (role === 'spectator') {
      console.log(
        getCurrentDate(),
        `switch role -> switching role to "player" in "${id}"`,
      )

      this.firestoreService.updateAttirbute<UserRole>('userRoles', id, {
        role: 'player',
      })

      this.spectatorService.delete()
      this.playerService.create()

      return
    }
  }
}
