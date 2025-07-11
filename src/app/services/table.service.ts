import { Injectable } from '@angular/core'
import { orderBy, where } from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { Table } from '../model/table.model'
import { TABLE_ID_KEY } from '../utils/constant'
import { getCurrentDate } from '../utils/date'
import { getMergedId, getTableId, getUserId, randomId } from '../utils/id'
import { FirestoreService } from './firestore.service'
import { OwnerService } from './owner.service'

@Injectable({
  providedIn: 'root',
})
export class TableService {
  constructor(
    private firestoreService: FirestoreService,
    private ownerService: OwnerService,
  ) {}

  async create(): Promise<void> {
    const id = getTableId()
    const code = id.split('-')[0].substring(0, 4)

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
      name: `Mesa ${code}`,
      createdAt: now,
      updatedAt: now,
    }

    this.firestoreService.save('tables', id, table)

    localStorage.setItem(TABLE_ID_KEY, id)

    this.ownerService.create()
  }

  async createNew(): Promise<void> {
    const id = randomId()
    const code = id.split('-')[0].substring(0, 4)
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

    await this.ownerService.createByTableId(id)

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

  async switch(tableId: string): Promise<void> {
    const { id } = getMergedId()

    const promises = [
      this.firestoreService.delete('votes', id),
      this.firestoreService.delete('players', id),
      this.firestoreService.delete('spectators', id),
      this.firestoreService.delete('userRoles', id),
    ]

    await Promise.all(promises)

    localStorage.setItem(TABLE_ID_KEY, tableId)
    window.location.reload()
  }

  async exit(): Promise<void> {
    const { id } = getMergedId()

    const promises = [
      this.firestoreService.delete('votes', id),
      this.firestoreService.delete('players', id),
      this.firestoreService.delete('spectators', id),
      this.firestoreService.delete('userRoles', id),
    ]

    await Promise.all(promises)

    window.location.href = '/'
  }

  async deleteCurrent(): Promise<void> {
    const tableId = getTableId()

    const tables = await this.firestoreService.getDocuments<Table>(
      'tables',
      where('id', '!=', tableId),
      where('ownerId', '==', getUserId()),
      orderBy('createdAt', 'desc'),
    )

    localStorage.setItem(TABLE_ID_KEY, tables[0].id)

    await this.firestoreService.delete('tables', tableId)
    await this.firestoreService.delete('countdowns', tableId)
    await this.firestoreService.deleteByTableId('owners', tableId)
    await this.firestoreService.deleteByTableId('spectators', tableId)
    await this.firestoreService.deleteByTableId('players', tableId)
    await this.firestoreService.deleteByTableId('userRoles', tableId)
    await this.firestoreService.deleteByTableId('tasks', tableId)
    await this.firestoreService.deleteByTableId('votes', tableId)

    window.location.reload()
  }
}
