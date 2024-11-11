import { Injectable } from '@angular/core'
import {
  doc,
  docData,
  DocumentReference,
  Firestore,
  setDoc,
} from '@angular/fire/firestore'
import { traceUntilFirst } from '@angular/fire/performance'
import { Observable } from 'rxjs'
import { Table } from '../model/table.model'
import { TableRepository } from '../repository/table.repository'
import { UserService } from './user.service'

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private ref: DocumentReference | null = null

  constructor(
    private firestore: Firestore,
    private tableRepository: TableRepository,
    private userService: UserService,
  ) {}

  private getLocalTable(): Table {
    const table = this.tableRepository.findLocalTable()

    if (table) {
      return table
    }

    const owner = this.userService.getLocalUser()

    return this.tableRepository.save({ name: 'Minha mesa', owner })
  }

  getTableObservable(): Observable<Table> {
    const table = this.getLocalTable()

    this.ref = doc(this.firestore, 'tables', table.id)

    setDoc(this.ref, table)

    return docData(this.ref).pipe(traceUntilFirst('firestore'))
  }

  changeName(name: string): void {
    const table = this.getLocalTable()

    const updatedTable: Table = {
      ...table,
      name,
    }

    setDoc(this.ref!, updatedTable)

    this.tableRepository.update(updatedTable)
  }
}
