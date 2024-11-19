import { Injectable } from '@angular/core'
import { where } from '@angular/fire/firestore'
import { map, Observable } from 'rxjs'
import { Card } from '../model/card.model'
import { User } from '../model/user.model'
import { Vote, VoteValueQuantity } from '../model/vote.model'
import { getCurrentDate } from '../utils/date'
import { getMergedId, getTableId } from '../utils/id'
import { FirestoreService } from './firestore.service'

@Injectable({
  providedIn: 'root',
})
export class VoteService {
  constructor(private firestoreService: FirestoreService) {}

  async create(card: Card): Promise<Vote> {
    const { id, tableId, userId } = getMergedId()

    const snapshot = await this.firestoreService.getDocumentSnapshot<User>(
      'users',
      userId,
    )

    const now = getCurrentDate()

    const vote: Vote = {
      id,
      value: card.value,
      cardId: card.id,
      user: snapshot.data()!,
      tableId: tableId,
      createdAt: now,
      updatedAt: now,
    }

    this.firestoreService.save('votes', id, vote)

    return vote
  }

  async update(card: Card): Promise<void> {
    const { id } = getMergedId()

    const snapshot = await this.firestoreService.getDocumentSnapshot<Vote>(
      'votes',
      id,
    )

    if (!snapshot.exists()) {
      this.create(card)
      return
    }

    const vote = snapshot.data()

    const updatedVote: Vote = {
      ...vote,
      cardId: card.id,
      value: card.value,
      updatedAt: getCurrentDate(),
    }

    this.firestoreService.update('votes', vote.id, updatedVote)
  }

  async exists(): Promise<boolean> {
    const { id } = getMergedId()

    const snapshot = await this.firestoreService.getDocumentSnapshot(
      'votes',
      id,
    )

    return snapshot.exists()
  }

  getVoteObservable(): Observable<Vote> {
    const { id } = getMergedId()

    return this.firestoreService.getDocumentObservable('votes', id)
  }

  getVotesObservable(): Observable<Vote[]> {
    return this.firestoreService.getCollecitonObservable(
      'votes',
      where('tableId', '==', getTableId()),
    )
  }

  getEstimationTotalObservable(): Observable<number> {
    return this.getVotesObservable().pipe(
      map((votes) => votes.reduce((acc, curr) => curr.value + acc, 0)),
    )
  }

  getEstimationAverageObservable(): Observable<number> {
    return this.getVotesObservable().pipe(
      map((votes) =>
        Math.floor(
          votes.reduce((acc, curr) => curr.value + acc, 0) / votes.length,
        ),
      ),
    )
  }

  getEstimationByQuantityObservable(): Observable<VoteValueQuantity[]> {
    return this.getVotesObservable().pipe(
      map((votes) =>
        Object.entries(
          votes.reduce<Record<string, number>>(
            (acc, curr) => ({
              ...acc,
              [curr.value]: (acc[curr.value] || 0) + 1,
            }),
            {},
          ),
        ).map<VoteValueQuantity>(([value, quantity]) => ({ value, quantity })),
      ),
    )
  }
}
