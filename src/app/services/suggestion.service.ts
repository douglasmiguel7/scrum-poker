import { Injectable } from '@angular/core'
import { NewSuggestion, Suggestion } from '../model/suggestion.model'
import { getCurrentDate } from '../utils/date'
import { getMergedId } from '../utils/id'
import { FirestoreService } from './firestore.service'

@Injectable({
  providedIn: 'root',
})
export class SuggestionService {
  constructor(private firestoreService: FirestoreService) {}

  save({ text }: NewSuggestion): void {
    const { id, tableId, userId } = getMergedId()
    const now = getCurrentDate()

    const suggestion: Suggestion = {
      id,
      tableId,
      userId,
      text,
      createdAt: now,
      updatedAt: now,
    }

    this.firestoreService.save('suggestions', id, suggestion)
  }
}
