import { Injectable } from '@angular/core'
import { where } from '@angular/fire/firestore'
import { ActivatedRoute } from '@angular/router'
import { Observable, switchMap } from 'rxjs'
import { Player } from '../model/player.model'
import { User } from '../model/user.model'
import { getTableId } from '../utils/table'
import { FirestoreService } from './firestore.service'
import { toUserId } from '../utils/map'

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
  ) {}

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
