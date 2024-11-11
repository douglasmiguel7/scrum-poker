import { Injectable } from '@angular/core'
import { NewTable, Table } from '../model/table.model'
import { TABLE_KEY } from '../utils/constant'
import { randomUuid } from '../utils/uuid'

@Injectable({
  providedIn: 'root',
})
export class TableRepository {
  save({ name, owner }: NewTable): Table {
    const table: Table = {
      id: randomUuid(),
      name,
      owner,
    }

    localStorage.setItem(TABLE_KEY, JSON.stringify(table))

    return table
  }

  update(table: Table): void {
    localStorage.setItem(TABLE_KEY, JSON.stringify(table))
  }

  findLocalTable(): Table | null {
    const table = localStorage.getItem(TABLE_KEY)

    if (!table) {
      return null
    }

    return JSON.parse(table) as Table
  }
}
