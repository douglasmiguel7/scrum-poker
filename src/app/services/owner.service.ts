import { Injectable } from '@angular/core'
import { Observable, switchMap } from 'rxjs'
import { Owner } from '../model/owner.model'
import { User } from '../model/user.model'
import { getTableId, getUserId } from '../utils/id'
import { FirestoreService } from './firestore.service'

@Injectable({
  providedIn: 'root',
})
export class OwnerService {
  constructor(private firestoreService: FirestoreService) {}
  async create(): Promise<void> {
    const tableId = getTableId()

    const exists = await this.firestoreService.exists('owners', tableId)
    if (exists) {
      return
    }

    const owner: Owner = {
      tableId,
      userId: getUserId(),
    }

    this.firestoreService.save('owners', tableId, owner)
  }

  getOwnerObservable(): Observable<User> {
    return this.firestoreService
      .getDocumentObservable<Owner>('owners', getTableId())
      .pipe(
        switchMap((owner: Owner) =>
          this.firestoreService.getDocumentObservable<User>(
            'users',
            owner.userId,
          ),
        ),
      )
  }
}
