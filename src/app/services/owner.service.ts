import { Injectable } from '@angular/core'
import { docData } from '@angular/fire/firestore'
import { traceUntilFirst } from '@angular/fire/performance'
import { Observable } from 'rxjs'
import { User } from '../model/user.model'
import { TableService } from './table.service'

@Injectable({
  providedIn: 'root',
})
export class OwnerService {
  constructor(private tableService: TableService) {}

  async getOwnerObservable(): Promise<Observable<User>> {
    const table = await this.tableService.getTableSnapshot()

    return docData(table.get('owner')).pipe(traceUntilFirst('firestore'))
  }
}
