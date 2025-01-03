import { Injectable } from '@angular/core'
import { where } from '@angular/fire/firestore'
import { ActivatedRoute } from '@angular/router'
import { Observable, switchMap } from 'rxjs'
import { Player } from '../model/player.model'
import { User } from '../model/user.model'
import { getMergedId, getTableId } from '../utils/id'
import { FirestoreService } from './firestore.service'

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
  ) {}

  async create(): Promise<void> {
    const { id, tableId, userId } = getMergedId()

    let exists = await this.firestoreService.exists('spectators', id)
    if (exists) {
      return
    }

    exists = await this.firestoreService.exists('players', id)
    if (exists) {
      return
    }

    const spectator: Player = {
      userId,
      tableId,
    }

    this.firestoreService.save('players', id, spectator)
  }

  async delete(): Promise<void> {
    const { id } = getMergedId()

    this.firestoreService.delete('players', id)
  }

  getPlayersObservable(): Observable<User[]> {
    const tableId = getTableId()

    return this.firestoreService
      .getCollecitonObservable<Player>(
        'players',
        where('tableId', '==', tableId),
      )
      .pipe(
        switchMap((players) =>
          this.firestoreService.getCollectionObservableByIds<User>(
            'users',
            ...players.map((player) => player.userId),
          ),
        ),
      )
  }
}
