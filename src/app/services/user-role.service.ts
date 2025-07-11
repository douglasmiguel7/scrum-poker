import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { UserRole } from '../model/user-role.model'
import { getMergedId } from '../utils/id'
import { FirestoreService } from './firestore.service'
import { PlayerService } from './player.service'
import { SpectatorService } from './spectator.service'
import { VoteService } from './vote.service'

@Injectable({
  providedIn: 'root',
})
export class UserRoleService {
  constructor(
    private firestoreService: FirestoreService,
    private voteService: VoteService,
    private spectatorService: SpectatorService,
    private playerService: PlayerService,
  ) {}

  async create(): Promise<void> {
    const { id, tableId } = getMergedId()

    const exists = await this.firestoreService.exists('userRoles', id)
    if (exists) {
      return
    }

    const userRole: UserRole = {
      role: 'spectator',
      tableId,
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
      return
    }

    if (role === 'player') {
      this.firestoreService.update('userRoles', id, {
        role: 'spectator',
      })

      await this.playerService.delete()
      await this.spectatorService.create()
      await this.voteService.delete()

      return
    }

    if (role === 'spectator') {
      this.firestoreService.update('userRoles', id, {
        role: 'player',
      })

      await this.spectatorService.delete()
      await this.playerService.create()

      return
    }
  }
}
