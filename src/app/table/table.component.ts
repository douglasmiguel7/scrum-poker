import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'

import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { NzAvatarModule } from 'ng-zorro-antd/avatar'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzDividerModule } from 'ng-zorro-antd/divider'
import { NzDropDownModule } from 'ng-zorro-antd/dropdown'
import { NzFlexModule } from 'ng-zorro-antd/flex'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzLayoutModule } from 'ng-zorro-antd/layout'
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header'
import { NzPopoverModule } from 'ng-zorro-antd/popover'
import { NzSpaceModule } from 'ng-zorro-antd/space'
import { NzTagModule } from 'ng-zorro-antd/tag'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip'
import { NzTypographyModule } from 'ng-zorro-antd/typography'
import { NzWaterMarkModule } from 'ng-zorro-antd/water-mark'
import { CountdownConfig, CountdownEvent, CountdownModule } from 'ngx-countdown'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { Card } from '../model/card.model'
import { Table } from '../model/table.model'
import { NewTask, Task } from '../model/task.model'
import { UserRole } from '../model/user-role.model'
import { User } from '../model/user.model'
import { CardService } from '../services/card.service'
import { OwnerService } from '../services/owner.service'
import { PlayerService } from '../services/player.service'
import { SpectatorService } from '../services/spectator.service'
import { TableService } from '../services/table.service'
import { TaskService } from '../services/task.service'
import { UserService } from '../services/user.service'

const LEFT_TIME_KEY = 'time'
const LEFT_TIME_DEFAULT = 0
const TIMER_STARTED_KEY = 'time_started'
const MINUTES_KEY = 'selected_minutes'
const MINUTES_DEFAULT = 1

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    NzDropDownModule,
    NzButtonModule,
    NzLayoutModule,
    NzTypographyModule,
    NzFlexModule,
    NzIconModule,
    NzDividerModule,
    NzAvatarModule,
    NzPageHeaderModule,
    NzSpaceModule,
    NzFormModule,
    CountdownModule,
    NzWaterMarkModule,
    NzToolTipModule,
    NzCardModule,
    NzTagModule,
    NzPopoverModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit {
  title = 'scrum-poker'

  env = environment

  estimationTotal = 0

  toggleAddAnotherTask = false

  countdownStarted = false

  countdownConfig: CountdownConfig = {
    demand: false,
    format: 'mm:ss',
    leftTime: LEFT_TIME_DEFAULT,
    notify: 0,
  }

  minutes = 0

  minutesOptions = [1, 2, 5, 10, 20, 30]

  votingTask: string | null = null

  votedCardId: string | null = null

  items = new Array(2).fill(null)

  cardsRevealed = false

  votes: { player: string; estimation: number }[] = []

  votingEstimationTotal = this.votes.reduce(
    (prev, curr) => prev + curr.estimation,
    0,
  )

  votingEstimationAverage = 0

  vote: { player: string; estimation: number } | null = null

  votesByQuantity: { estimation: string; quantity: number }[] = []

  validateForm: FormGroup

  user$: Observable<User>
  table$: Observable<Table>
  owner$: Observable<User>
  cards$: Observable<Card[]>
  tasks$: Observable<Task[]>
  players$: Observable<User[]>
  spectators$: Observable<User[]>

  userRole: UserRole = 'spectator'

  constructor(
    private fb: NonNullableFormBuilder,
    private userService: UserService,
    private tableService: TableService,
    private cardService: CardService,
    private taskService: TaskService,
    private ownerService: OwnerService,
    private playerService: PlayerService,
    private spectatorService: SpectatorService,
  ) {
    console.log('constructor table component')

    this.validateForm = this.fb.group({
      title: this.fb.control('', [Validators.required]),
      link: this.fb.control(''),
    })

    this.user$ = this.userService.getUserObservable()
    this.cards$ = this.cardService.getCardsObservable()
    this.table$ = this.tableService.getTableObservable()
    this.owner$ = this.ownerService.getOwnerObservable()
    this.tasks$ = this.taskService.getTasksObservable()
    this.players$ = this.playerService.getPlayersObservable()
    this.spectators$ = this.spectatorService.getSpectatorsObservable()

    this.loadTimer()
  }

  ngOnInit(): void {
    console.log('init table component')
    this.tableService.create()
    this.userService.create()
    this.spectatorService.create()
  }

  private loadTimer(): void {
    let leftTime = Number(
      localStorage.getItem(LEFT_TIME_KEY) || LEFT_TIME_DEFAULT,
    )

    leftTime = isNaN(leftTime) ? LEFT_TIME_DEFAULT : leftTime

    this.countdownConfig = {
      ...this.countdownConfig,
      leftTime: leftTime / 1000,
    }

    this.countdownStarted = localStorage.getItem(TIMER_STARTED_KEY) === 'true'

    let minutes = Number(localStorage.getItem(MINUTES_KEY) || MINUTES_DEFAULT)
    minutes = isNaN(minutes) ? MINUTES_DEFAULT : minutes

    this.minutes = minutes
  }

  async handleUsernameChange(name: string) {
    await this.userService.changeName(name.slice(0, 20))
  }

  async handleTableNameChange(name: string) {
    await this.tableService.changeName(name.slice(0, 40))
  }

  handleToggleAddAnotherTask(): void {
    this.toggleAddAnotherTask = !this.toggleAddAnotherTask
  }

  handleSaveAnotherTask(): void {
    if (!this.validateForm.valid) {
      return
    }

    const value = this.validateForm.value as NewTask

    this.taskService.save(value)

    this.validateForm.reset()
  }

  handleDeleteTask(id: string) {
    this.taskService.delete(id)
  }

  handleStartTimer(minutes: number): void {
    this.countdownStarted = true

    this.countdownConfig = {
      ...this.countdownConfig,
      leftTime: 60 * minutes,
    }

    this.minutes = minutes

    localStorage.setItem(TIMER_STARTED_KEY, 'true')

    localStorage.setItem(MINUTES_KEY, `${minutes}`)
  }

  handleRestartTimer(): void {
    console.log({ minutes: this.minutes })

    this.countdownConfig = {
      ...this.countdownConfig,
      leftTime: 60 * this.minutes,
    }
  }

  handleStopTimer(): void {
    this.countdownStarted = false

    this.countdownConfig = {
      ...this.countdownConfig,
      leftTime: 0,
    }

    localStorage.setItem(TIMER_STARTED_KEY, 'false')

    localStorage.setItem(LEFT_TIME_KEY, '0')
  }

  handleAddOneMinute(): void {
    let leftTime = (localStorage.getItem(LEFT_TIME_KEY) || 0) as number
    if (leftTime <= 0 || isNaN(leftTime)) {
      leftTime = LEFT_TIME_DEFAULT
    }

    this.countdownConfig = {
      ...this.countdownConfig,
      leftTime: leftTime / 1000 + 60,
    }

    this.minutes = this.minutes + 1

    localStorage.setItem(MINUTES_KEY, `${this.minutes}`)
  }

  handleTimerEvent(event: CountdownEvent): void {
    switch (event.action) {
      case 'done':
        this.countdownStarted = false

        localStorage.setItem(LEFT_TIME_KEY, '0')

        break
      case 'notify':
        if (!this.countdownStarted) {
          break
        }

        localStorage.setItem(LEFT_TIME_KEY, `${event.left}`)

        break
    }
  }

  handleTaskToVote(id: string) {
    if (this.votingTask === id) {
      this.votingTask = null
      return
    }

    this.votingTask = id

    this.taskService.select(id)
  }

  handleVote({ id, value }: { id: string; value: number }) {
    this.votedCardId = id
    this.vote = { player: 'doug', estimation: value }
    this.votes = [this.vote]
    this.votingEstimationTotal = this.votes.reduce(
      (prev, curr) => prev + curr.estimation,
      0,
    )

    this.votingEstimationAverage = Math.floor(
      this.votes.reduce((prev, curr) => prev + curr.estimation, 0) /
        this.votes.length,
    )

    this.votesByQuantity = Object.entries(
      this.votes.reduce(
        (prev, curr) => ({
          ...prev,
          [curr.estimation]: (prev[curr.estimation] || 0) + 1,
        }),
        {} as Record<number, number>,
      ),
    ).map(([estimation, quantity]) => ({ estimation, quantity }))
  }

  handleCardsRevealed() {
    this.cardsRevealed = !this.cardsRevealed
  }

  handleUserRoleChange() {
    if (this.userRole === 'spectator') {
      this.userRole = 'player'
      return
    }

    if (this.userRole === 'player') {
      this.userRole = 'spectator'
      return
    }

    console.log(`user role -> ${this.userRole}`)
  }
}
