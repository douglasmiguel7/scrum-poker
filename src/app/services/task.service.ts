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
import { getTableId, randomUuid } from '../utils/id'
import { FirestoreService } from './firestore.service'

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    private firestore: Firestore,
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
  ) {}

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
      tableId: getTableId(),
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
