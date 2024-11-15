import { Injectable } from '@angular/core'
import { where } from '@angular/fire/firestore'
import { ActivatedRoute } from '@angular/router'
import { Observable, switchMap } from 'rxjs'
import { Spectator } from '../model/spectator.model'
import { User } from '../model/user.model'
import { getCurrentDate } from '../utils/date'
import { toUserId } from '../utils/map'
import { getTableId } from '../utils/table'
import { getUserId } from '../utils/user'
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
    const tableId = getTableId(this.route)
    const userId = getUserId()

    const id = `${tableId}-${userId}`

    const exists = await this.firestoreService.exists('spectators', id)
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
      id,
      userId,
      tableId,
    }

    this.firestoreService.save('spectators', id, spectator)
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
