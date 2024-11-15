import { Injectable } from '@angular/core'
import { deleteDoc, where } from '@angular/fire/firestore'
import { ActivatedRoute } from '@angular/router'
import { Observable, switchMap } from 'rxjs'
import { Player } from '../model/player.model'
import { User } from '../model/user.model'
import { getCurrentDate } from '../utils/date'
import { toUserId } from '../utils/map'
import { getTableId } from '../utils/table'
import { getUserId } from '../utils/user'
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
    const tableId = getTableId(this.route)
    const userId = getUserId()

    const id = `${tableId}-${userId}`

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
      id,
      userId,
      tableId,
    }

    this.firestoreService.save('players', id, spectator)
  }

  async delete(): Promise<void> {
    const tableId = getTableId(this.route)
    const userId = getUserId()

    const id = `${tableId}-${userId}`

    const reference = this.firestoreService.getDocumentReference('players', id)

    await deleteDoc(reference)
  }

  getPlayersObservable(): Observable<User[]> {
    const tableId = getTableId(this.route)

    return this.firestoreService
      .getCollecitonObservable<Player>(
        'players',
        where('tableId', '==', tableId),
      )
      .pipe(
        switchMap((players) =>
          this.firestoreService.getCollectionObservableByIds<User>(
            'users',
            ...players.map(toUserId),
          ),
        ),
      )
  }
}
