import { Injectable } from '@angular/core'
import { CountdownEvent } from 'ngx-countdown'
import { map, Observable } from 'rxjs'
import { Countdown } from '../model/countdown.model'
import { getTableId } from '../utils/id'
import { FirestoreService } from './firestore.service'

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  private started = false

  constructor(private firestoreService: FirestoreService) {}

  private getLeftTimeKey(): string {
    return `left_time_${getTableId()}`
  }

  private getLeftTime(): number {
    const leftTime = Number(localStorage.getItem(this.getLeftTimeKey()) || 0)

    return isNaN(leftTime) ? 0 : leftTime
  }

  private calculateLeftTime(currentLeftTime: number): number {
    const leftTime = this.getLeftTime()

    if (this.started) {
      return leftTime
    }

    return currentLeftTime
  }

  private setLeftTime(leftTime: number): void {
    localStorage.setItem(this.getLeftTimeKey(), leftTime.toString())
  }

  getCountdownObservable(): Observable<Countdown> {
    return this.firestoreService
      .getDocumentObservable<Countdown>('countdowns', getTableId())
      .pipe(
        map((countdown) => {
          this.started = countdown.started

          const leftTime = this.getLeftTime()
          if (leftTime) {
            return { ...countdown, leftTime }
          }

          return countdown
        }),
      )
  }

  getCountdownStartedObservable(): Observable<boolean> {
    return this.getCountdownObservable().pipe(
      map((countdown) => countdown.started),
    )
  }

  async create(): Promise<void> {
    const id = getTableId()

    const snapshot = await this.firestoreService.getDocumentSnapshot(
      'countdowns',
      id,
    )

    if (snapshot.exists()) {
      return
    }

    const countdownConfig: Countdown = {
      started: false,
      minutes: 0,
      demand: false,
      format: 'mm:ss',
      leftTime: 0,
      notify: 0,
    }

    this.firestoreService.save('countdowns', id, countdownConfig)
  }

  start(minutes: number): void {
    const leftTime = 60 * minutes

    const countdown: Partial<Countdown> = {
      minutes,
      leftTime,
      started: true,
    }

    this.firestoreService.update('countdowns', getTableId(), countdown)
  }

  stop(): void {
    this.started = false

    const countdown: Partial<Countdown> = {
      leftTime: 0,
      started: false,
    }

    this.firestoreService.update('countdowns', getTableId(), countdown)
    localStorage.setItem(this.getLeftTimeKey(), '0')
  }

  async restart(): Promise<void> {
    const id = getTableId()

    const snapshot = await this.firestoreService.getDocumentSnapshot<Countdown>(
      'countdowns',
      id,
    )

    if (!snapshot.exists()) {
      return
    }

    const countdown = snapshot.data()
    const leftTime = 60 * countdown.minutes

    this.firestoreService.update('countdowns', id, { leftTime })
    this.setLeftTime(leftTime)
  }

  async addOneMinute(): Promise<void> {
    if (!this.started) {
      return
    }

    const snapshot = await this.firestoreService.getDocumentSnapshot<Countdown>(
      'countdowns',
      getTableId(),
    )

    if (!snapshot.exists()) {
      return
    }

    const countdown = snapshot.data()

    const leftTime = this.getLeftTime() + 60

    const updatedCountdown: Partial<Countdown> = {
      ...countdown,
      leftTime: leftTime,
      minutes: countdown.minutes + 1,
    }

    this.firestoreService.update('countdowns', getTableId(), updatedCountdown)
    this.setLeftTime(leftTime)
  }

  handleEvent(event: CountdownEvent): void {
    switch (event.action) {
      case 'done':
        if (!this.started) {
          return
        }

        console.log('done', event)

        this.stop()

        break

      case 'notify':
        if (!this.started) {
          return
        }

        console.log('notify', event)

        localStorage.setItem(
          this.getLeftTimeKey(),
          (event.left / 1000).toString(),
        )

        break
    }
  }
}
