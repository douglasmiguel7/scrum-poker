import { Injectable } from '@angular/core'
import { orderBy, where } from '@angular/fire/firestore'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { Table } from '../model/table.model'
import { TABLE_ID_KEY } from '../utils/constant'
import { getCurrentDate } from '../utils/date'
import { getTableId, getUserId, randomUuid } from '../utils/id'
import { FirestoreService } from './firestore.service'
import { OwnerService } from './owner.service'

@Injectable({
  providedIn: 'root',
})
export class TableService {
  constructor(
    private firestoreService: FirestoreService,
    private router: Router,
    private ownerService: OwnerService,
  ) {}

  async create(): Promise<void> {
    const id = getTableId()

    const exists = await this.firestoreService.exists('tables', id)
    if (exists) {
      return
    }

    const now = getCurrentDate()

    const table: Table = {
      id,
      open: true,
      cardsRevealed: false,
      ownerId: getUserId(),
      name: 'Minha mesa',
      createdAt: now,
      updatedAt: now,
    }

    this.firestoreService.save('tables', id, table)
    this.ownerService.create()
  }

  async createNew(): Promise<void> {
    const id = randomUuid()
    const code = id.split('-')[0]
    const now = getCurrentDate()

    const table: Table = {
      id,
      open: true,
      cardsRevealed: false,
      ownerId: getUserId(),
      name: `Mesa ${code}`,
      createdAt: now,
      updatedAt: now,
    }

    this.firestoreService.save('tables', id, table)
    localStorage.setItem(TABLE_ID_KEY, id)
    this.ownerService.create()
    window.location.reload()
  }

  switch(id: string): void {
    localStorage.setItem(TABLE_ID_KEY, id)
    window.location.reload()
  }

  getTableObservable(): Observable<Table> {
    return this.firestoreService.getDocumentObservable('tables', getTableId())
  }

  getTablesObservable(): Observable<Table[]> {
    return this.firestoreService.getCollecitonObservable<Table>(
      'tables',
      where('id', '!=', getTableId()),
      where('ownerId', '==', getUserId()),
      orderBy('createdAt', 'desc'),
    )
  }

  changeName(name: string): void {
    this.firestoreService.update('tables', getTableId(), {
      name,
    })
  }

  revealCards(): void {
    this.firestoreService.update('tables', getTableId(), {
      cardsRevealed: true,
    })
  }

  startNewVoting(): void {
    const tableId = getTableId()

    this.firestoreService.update('tables', tableId, {
      cardsRevealed: false,
    })

    this.firestoreService.deleteByTableId('votes', tableId)
  }
}
