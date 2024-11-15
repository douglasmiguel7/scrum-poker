import { Injectable } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable, of, switchMap } from 'rxjs'
import { Owner } from '../model/owner.model'
import { User } from '../model/user.model'
import { getCurrentDate } from '../utils/date'
import { getTableId } from '../utils/table'
import { getUserId } from '../utils/user'
import { randomUuid } from '../utils/uuid'
import { FirestoreService } from './firestore.service'

@Injectable({
  providedIn: 'root',
})
export class OwnerService {
  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
  ) {}
  async create(): Promise<void> {
    const tableId = getTableId(this.route)

    const exists = await this.firestoreService.exists('owners', tableId)
    if (exists) {
      console.log(
        getCurrentDate(),
        `create owner -> already exists "owner/${tableId}"`,
      )
      return
    }

    console.log(
      getCurrentDate(),
      `create owner -> creating "owners/${tableId}"`,
    )

    const owner: Owner = {
      id: randomUuid(),
      tableId,
      userId: getUserId(),
    }

    this.firestoreService.save('owners', tableId, owner)
  }

  getOwnerObservable(): Observable<User> {
    return this.firestoreService
      .getDocumentObservable<Owner>('owners', getTableId(this.route))
      .pipe(
        switchMap((owner: Owner) =>
          owner
            ? this.firestoreService.getDocumentObservableById<User>(
                'users',
                owner.userId,
              )
            : of(),
        ),
      )
  }
}
