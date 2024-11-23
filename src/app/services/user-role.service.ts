import { Injectable } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { UserRole } from '../model/user-role.model'
import { getCurrentDate } from '../utils/date'
import { getMergedId } from '../utils/id'
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
    const { id } = getMergedId()

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
    const { id } = getMergedId()

    return this.firestoreService.getDocumentObservable('userRoles', id)
  }

  async switchRole(): Promise<void> {
    const { id } = getMergedId()

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

      this.firestoreService.update('userRoles', id, {
        role: 'spectator',
      })

      // TODO apagar os votos deste usuario

      await this.playerService.delete()
      await this.spectatorService.create()

      return
    }

    if (role === 'spectator') {
      console.log(
        getCurrentDate(),
        `switch role -> switching role to "player" in "${id}"`,
      )

      this.firestoreService.update('userRoles', id, {
        role: 'player',
      })

      await this.spectatorService.delete()
      await this.playerService.create()

      return
    }
  }
}
