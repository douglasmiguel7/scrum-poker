import { Injectable } from '@angular/core'
import {
  deleteField,
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
import { NewTask, Task } from '../model/task.model'
import { TABLE_ID_KEY } from '../utils/constant'
import { getCurrentDate } from '../utils/date'
import { getTableId } from '../utils/table'
import { getUserId } from '../utils/user'
import { randomUuid } from '../utils/uuid'
import { UserService } from './user.service'

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private ref: DocumentReference
  private id: string
  private sampleId = 'a3725d11-e424-4f98-81f3-7a731b59e99b'

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

  getTableObservable(): Observable<Table> {
    return new Observable((subscriber) => {
      getDoc(this.ref).then((doc) => {
        if (doc.exists()) {
          docData(this.ref)
            .pipe(traceUntilFirst('firestore'))
            .subscribe((table: Table) => subscriber.next(table))

          return
        }

        const owner = this.userService.getRef()
        const now = getCurrentDate()

        const table: Table = {
          id: this.id,
          name: 'Minha mesa',
          open: true,
          userRole: {
            [getUserId()]: 'owner',
          },
          owner,
          players: [],
          spectators: [],
          tasks: {},
          createdAt: now,
          updatedAt: now,
        }

        localStorage.setItem(TABLE_ID_KEY, this.id)

        setDoc(this.ref, table)

        subscriber.next(table)
      })
    })
  }

  addTask({ title, link }: NewTask): void {
    const id = randomUuid()

    const now = getCurrentDate()

    const task: Task = {
      id,
      link,
      title,
      estimation: 0,
      selected: false,
      voted: false,
      votes: {},
      createdAt: now,
      updatedAt: now,
    }

    const path = `tasks.${id}`

    updateDoc(this.ref, { [path]: task })
  }

  removeTask(id: string): void {
    const path = `tasks.${id}`

    updateDoc(this.ref, { [path]: deleteField() })
  }

  changeName(name: string): void {
    const table: Partial<Table> = {
      name,
      updatedAt: getCurrentDate(),
    }

    updateDoc(this.ref, table)
  }

  async selectTask(): Promise<void> {
    const path = `tasks.${this.sampleId}.selected`

    updateDoc(this.ref, {
      [path]: true,
    })
  }
}
