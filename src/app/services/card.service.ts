import { Injectable } from '@angular/core'
import { orderBy, where } from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { Card, CardPack } from '../model/card.model'
import { FirestoreService } from './firestore.service'

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private firestoreService: FirestoreService) {}

  getCardsObservable(): Observable<Card[]> {
    return this.firestoreService.getCollecitonObservable(
      'cards',
      where('pack', '==', CardPack.Default),
      orderBy('position', 'asc'),
    )
  }
}
