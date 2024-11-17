import { Injectable } from '@angular/core'
import { where } from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { Card } from '../model/card.model'
import { Vote } from '../model/vote.model'
import { getCurrentDate } from '../utils/date'
import { getMergedId, getTableId } from '../utils/id'
import { FirestoreService } from './firestore.service'

@Injectable({
  providedIn: 'root',
})
export class VoteService {
  constructor(private firestoreService: FirestoreService) {}

  create(card: Card): Vote {
    const { id, tableId, userId } = getMergedId()
    const now = getCurrentDate()

    const vote: Vote = {
      id,
      value: card.value,
      cardId: card.id,
      userId: userId,
      tableId: tableId,
      createdAt: now,
      updatedAt: now,
    }

    this.firestoreService.save('votes', id, vote)

    return vote
  }

  update(vote: Vote, card: Card): Vote {
    const newVote: Vote = {
      ...vote,
      cardId: card.id,
      value: card.value,
      updatedAt: getCurrentDate(),
    }

    this.firestoreService.update('votes', vote.id, newVote)

    return newVote
  }

  getVoteObservable(): Observable<Vote> {
    const { id } = getMergedId()

    return this.firestoreService.getDocumentObservable('votes', id)
  }

  getVotesObservable(): Observable<Vote[]> {
    const tableId = getTableId()

    return this.firestoreService.getCollecitonObservable(
      'votes',
      where('tableId', '==', tableId),
    )
  }
}
