import { Injectable } from '@angular/core'
import {
  doc,
  docData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore'
import { traceUntilFirst } from '@angular/fire/performance'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { Table } from '../model/table.model'
import { TABLE_ID_KEY } from '../utils/constant'
import { getCurrentDate } from '../utils/date'
import { getTableId } from '../utils/table'
import { UserService } from './user.service'

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private ref: DocumentReference
  private id: string

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {
    this.id = getTableId(this.route)
    this.ref = doc(this.firestore, 'tables', this.id)
  }

  async getTableSnapshot(): Promise<DocumentSnapshot> {
    return getDoc(this.ref)
  }

  async getTableObservable(): Promise<Observable<Table>> {
    const doc = await getDoc(this.ref)

    const exists = doc.exists()

    if (!exists) {
      const owner = this.userService.getRef()

      const now = getCurrentDate()

      const table: Table = {
        id: this.id,
        name: 'Minha mesa',
        owner,
        createdAt: now,
        updatedAt: now,
      }

      localStorage.setItem(TABLE_ID_KEY, this.id)

      await setDoc(this.ref, table)
    }

    return docData(this.ref).pipe(traceUntilFirst('firestore'))
  }

  changeName(name: string): void {
    const table: Partial<Table> = {
      name,
      updatedAt: getCurrentDate(),
    }

    updateDoc(this.ref, table)
  }
}
