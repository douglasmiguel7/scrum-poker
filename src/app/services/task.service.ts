import { Injectable } from '@angular/core'
import {
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { NewTask, Task } from '../model/task.model'
import { getCurrentDate } from '../utils/date'
import { getTableId } from '../utils/table'
import { randomUuid } from '../utils/uuid'
import { FirestoreService } from './firestore.service'

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  tableId: string

  constructor(
    private firestore: Firestore,
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
  ) {
    this.tableId = getTableId(this.route)
  }

  getTasksObservable(): Observable<Task[]> {
    return this.firestoreService.getCollecitonObservable<Task>(
      'tasks',
      orderBy('createdAt', 'desc'),
    )
  }

  save({ title, link }: NewTask): void {
    const id = randomUuid()
    const now = getCurrentDate()

    const task: Task = {
      id,
      tableId: this.tableId,
      link,
      title,
      estimation: 0,
      selected: false,
      voted: false,
      createdAt: now,
      updatedAt: now,
    }

    const ref = doc(this.firestore, 'tasks', id)
    setDoc(ref, task)
  }

  select(id: string): void {
    const ref = doc(this.firestore, 'tasks', id)
    updateDoc(ref, { selected: true })
  }

  delete(id: string): void {
    const ref = doc(this.firestore, 'tasks', id)
    deleteDoc(ref)
  }

  updateTitle(id: string, title: string): void {
    const ref = doc(this.firestore, 'tasks', id)
    updateDoc(ref, { title })
  }

  updateLink(id: string, link: string): void {
    const ref = doc(this.firestore, 'tasks', id)
    updateDoc(ref, { link })
  }
}
