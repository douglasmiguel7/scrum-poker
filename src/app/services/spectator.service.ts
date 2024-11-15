import { Injectable } from '@angular/core'
import { deleteDoc, where } from '@angular/fire/firestore'
import { ActivatedRoute } from '@angular/router'
import { Observable, switchMap } from 'rxjs'
import { Spectator } from '../model/spectator.model'
import { User } from '../model/user.model'
import { getCurrentDate } from '../utils/date'
import { getMergedId, getTableId } from '../utils/id'
import { toUserId } from '../utils/map'
import { FirestoreService } from './firestore.service'

@Injectable({
  providedIn: 'root',
})
export class SpectatorService {
  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
  ) {}

  async create(): Promise<void> {
    const { id, tableId, userId } = getMergedId(this.route)

    let exists = await this.firestoreService.exists('players', id)
    if (exists) {
      console.log(
        getCurrentDate(),
        `create spectator -> already exists as a player "players/${id}"`,
      )
      return
    }

    exists = await this.firestoreService.exists('spectators', id)
    if (exists) {
      console.log(
        getCurrentDate(),
        `create spectator -> already exists "spectators/${id}"`,
      )
      return
    }

    console.log(
      getCurrentDate(),
      `create spectator -> creating "spectators/${id}"`,
    )

    const spectator: Spectator = {
      userId,
      tableId,
    }

    this.firestoreService.save('spectators', id, spectator)
  }

  async delete(): Promise<void> {
    const { id } = getMergedId(this.route)

    const reference = this.firestoreService.getDocumentReference(
      'spectators',
      id,
    )

    await deleteDoc(reference)
  }

  getSpectatorsObservable(): Observable<User[]> {
    const tableId = getTableId(this.route)

    return this.firestoreService
      .getCollecitonObservable<Spectator>(
        'spectators',
        where('tableId', '==', tableId),
      )
      .pipe(
        switchMap((spectators) =>
          this.firestoreService.getCollectionObservableByIds<User>(
            'users',
            ...spectators.map(toUserId),
          ),
        ),
      )
  }
}
