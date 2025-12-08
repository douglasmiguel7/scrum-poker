import { Injectable } from '@angular/core'
import { orderBy, where } from '@angular/fire/firestore'
import { map, Observable, switchMap } from 'rxjs'
import { NewTask, SelectedTask, Task } from '../model/task.model'
import { getCurrentDate } from '../utils/date'
import { getTableId, randomId } from '../utils/id'
import { FirestoreService } from './firestore.service'

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private firestoreService: FirestoreService) {}

  getTasksObservable(): Observable<Task[]> {
    return this.firestoreService.getCollecitonObservable<Task>(
      'tasks',
      where('tableId', '==', getTableId()),
      orderBy('createdAt', 'desc'),
    )
  }

  getEstimationTotalObservable(): Observable<number> {
    return this.getTasksObservable().pipe(
      map((task) =>
        task.map((t) => t.estimation).reduce((prev, curr) => prev + curr, 0),
      ),
    )
  }

  getSelectedTaskIdObservable(): Observable<Task> {
    return this.firestoreService
      .getDocumentObservable<SelectedTask>('selectedTasks', getTableId())
      .pipe(
        switchMap((selectedTask) =>
          this.firestoreService.getDocumentObservable<Task>(
            'tasks',
            selectedTask.id,
          ),
        ),
      )
  }

  save({ title, link }: NewTask): void {
    const id = randomId()
    const now = getCurrentDate()

    const task: Task = {
      id,
      tableId: getTableId(),
      link: link || undefined,
      title,
      estimation: 0,
      voted: false,
      createdAt: now,
      updatedAt: now,
    }

    this.firestoreService.save('tasks', id, task)
  }

  select(task: Task): void {
    this.firestoreService.save('selectedTasks', getTableId(), task)
  }

  async delete(id: string): Promise<void> {
    this.firestoreService.delete('tasks', id)

    const tableId = getTableId()

    const snapshot =
      await this.firestoreService.getDocumentSnapshot<SelectedTask>(
        'selectedTasks',
        tableId,
      )

    if (!snapshot.exists()) {
      return
    }

    const isSelectedTask = snapshot.data().id === id
    if (!isSelectedTask) {
      return
    }

    this.firestoreService.delete('selectedTasks', tableId)
  }

  update(id: string, task: Partial<Task>): void {
    this.firestoreService.update('tasks', id, task)
  }
}
