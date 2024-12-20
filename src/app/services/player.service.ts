import { Injectable } from '@angular/core'
import { deleteDoc, where } from '@angular/fire/firestore'
import { ActivatedRoute } from '@angular/router'
import { Observable, switchMap } from 'rxjs'
import { Player } from '../model/player.model'
import { User } from '../model/user.model'
import { getCurrentDate } from '../utils/date'
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
      console.log(
        getCurrentDate(),
        `create player -> already exists as a spectator "spectators/${id}"`,
      )
      return
    }

    exists = await this.firestoreService.exists('players', id)
    if (exists) {
      console.log(
        getCurrentDate(),
        `create player -> already exists "players/${id}"`,
      )
      return
    }

    console.log(getCurrentDate(), `create player -> creating "players/${id}"`)

    const spectator: Player = {
      userId,
      tableId,
    }

    this.firestoreService.save('players', id, spectator)
  }

  async delete(): Promise<void> {
    const { id } = getMergedId()

    const reference = this.firestoreService.getDocumentReference('players', id)

    await deleteDoc(reference)
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
