import { Injectable } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { Table } from '../model/table.model'
import { getCurrentDate } from '../utils/date'
import { FirestoreService } from './firestore.service'
import { OwnerService } from './owner.service'
import { getTableId } from '../utils/id'

@Injectable({
  providedIn: 'root',
})
export class TableService {
  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private ownerService: OwnerService,
  ) {}

  async create(): Promise<void> {
    const id = getTableId(this.route)

    const exists = await this.firestoreService.exists('tables', id)
    if (exists) {
      console.log(
        getCurrentDate(),
        `create table -> already exists "tables/${id}"`,
      )
      return
    }

    console.log(getCurrentDate(), `create table -> creating "tables/${id}"`)

    const now = getCurrentDate()

    const table: Table = {
      id,
      open: true,
      name: 'Minha mesa',
      createdAt: now,
      updatedAt: now,
    }

    this.firestoreService.save('tables', id, table)
    this.ownerService.create()
  }

  getTableObservable(): Observable<Table> {
    return this.firestoreService.getDocumentObservable(
      'tables',
      getTableId(this.route),
    )
  }

  changeName(name: string): void {
    this.firestoreService.update('tables', getTableId(this.route), {
      name,
    })
  }
}
