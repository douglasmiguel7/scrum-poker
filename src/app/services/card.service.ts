import { Injectable } from '@angular/core'
import {
  doc,
  docData,
  DocumentReference,
  Firestore,
} from '@angular/fire/firestore'
import { traceUntilFirst } from '@angular/fire/performance'
import { map, Observable } from 'rxjs'
import { Card } from '../model/card.model'

@Injectable({
  providedIn: 'root',
})
export class CardService {
  ref: DocumentReference

  constructor(private firestore: Firestore) {
    this.ref = doc(this.firestore, 'cards', 'default')
  }

  async getCardsObservable(): Promise<Observable<Card[]>> {
    return docData(this.ref).pipe(
      traceUntilFirst('firestore'),
      map((document: { cards: Card[] }) => document.cards),
    )
  }
}
