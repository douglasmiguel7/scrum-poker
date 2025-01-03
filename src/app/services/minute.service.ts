import { Injectable } from '@angular/core'
import { orderBy } from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { Minute } from '../model/minute.model'
import { FirestoreService } from './firestore.service'

@Injectable({
  providedIn: 'root',
})
export class MinuteService {
  constructor(private firestoreService: FirestoreService) {}

  getMinutesObservable(): Observable<Minute[]> {
    return this.firestoreService.getCollecitonObservable(
      'minutes',
      orderBy('value', 'asc'),
    )
  }
}
