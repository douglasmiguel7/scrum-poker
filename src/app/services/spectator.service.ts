import { Injectable } from '@angular/core'
import { deleteDoc, where } from '@angular/fire/firestore'
import { ActivatedRoute } from '@angular/router'
import { Observable, switchMap } from 'rxjs'
import { Spectator } from '../model/spectator.model'
import { User } from '../model/user.model'
import { getMergedId, getTableId } from '../utils/id'
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
    const { id, tableId, userId } = getMergedId()

    let exists = await this.firestoreService.exists('players', id)
    if (exists) {
      return
    }

    exists = await this.firestoreService.exists('spectators', id)
    if (exists) {
      return
    }

    const spectator: Spectator = {
      userId,
      tableId,
    }

    this.firestoreService.save('spectators', id, spectator)
  }

  async delete(): Promise<void> {
    const { id } = getMergedId()

    const reference = this.firestoreService.getDocumentReference(
      'spectators',
      id,
    )

    await deleteDoc(reference)
  }

  getSpectatorsObservable(): Observable<User[]> {
    const tableId = getTableId()

    return this.firestoreService
      .getCollecitonObservable<Spectator>(
        'spectators',
        where('tableId', '==', tableId),
      )
      .pipe(
        switchMap((spectators) =>
          this.firestoreService.getCollectionObservableByIds<User>(
            'users',
            ...spectators.map((spectator) => spectator.userId),
          ),
        ),
      )
  }
}
