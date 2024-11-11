import { Injectable } from '@angular/core'
import { Table } from '../model/table.model'
import { User } from '../model/user.model'
import { TableRepository } from '../repository/table.repository'

@Injectable({
  providedIn: 'root',
})
export class TableService {
  constructor(private repository: TableRepository) {}

  findTableByUser(user: User): Table {
    const table = this.repository.findLocalTable()

    if (table) {
      return table
    }

    return this.repository.save({ name: 'Minha mesa', owner: user })
  }
}
