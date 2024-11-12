import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'

import { NzAvatarModule } from 'ng-zorro-antd/avatar'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzDividerModule } from 'ng-zorro-antd/divider'
import { NzDropDownModule } from 'ng-zorro-antd/dropdown'
import { NzFlexModule } from 'ng-zorro-antd/flex'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzIconModule } from 'ng-zorro-antd/icon'
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
import { User } from '../model/user.model'
import { CardService } from '../services/card.service'
import { OwnerService } from '../services/owner.service'
import { TableService } from '../services/table.service'
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
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit {
  title = 'scrum-poker'

  testDocValue$: Observable<{ quantidade: number }> | null = null

  spectators = new Array(3)
    .fill(null)
    .map((_, index) => `Exemplo nome grande ${index}`)

  players = new Array(5).fill(null).map((_, index) => `Maria ${index}`)

  env = environment

  tasks: {
    id: number
    title: string
    link: string
    estimation: number
    voted: boolean
  }[] = new Array(2).fill(null).map((_, index) => ({
    id: index,
    title: `Titulo ${index}`,
    link: `https://scrum-poker.opentools.org?taksId=${index}`,
    estimation: Math.floor(Math.random() * (index + 1) * 2),
    voted: Math.random() < 0.5,
  }))

  estimationTotal: number = this.tasks.reduce(
    (prev, curr) => prev + curr.estimation,
    0,
  )

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

  votingTask: number | null = null

  votedCardId: string | null = null

  items = new Array(2).fill(null)

  cardsRevealed = false

  votes: { player: string; estimation: number }[] = []

  votingEstimationTotal = this.votes.reduce(
    (prev, curr) => prev + curr.estimation,
    0,
  )

  votingEstimationAverage = Math.floor(
    this.votes.reduce((prev, curr) => prev + curr.estimation, 0) /
      this.players.length,
  )

  vote: { player: string; estimation: number } | null = null

  votesByQuantity: { estimation: string; quantity: number }[] = []

  user: Observable<User> | null = null

  table: Observable<Table> | null = null

  owner: Observable<User> | null = null

  cards: Observable<Card[]> | null = null

  constructor(
    private userService: UserService,
    private tableService: TableService,
    private ownerService: OwnerService,
    private cardService: CardService,
  ) {}

  async ngOnInit(): Promise<void> {
    const [user, cards, table, owner] = await Promise.all([
      this.userService.getUserObservable(),
      this.cardService.getCardsObservable(),
      this.tableService.getTableObservable(),
      this.ownerService.getOwnerObservable(),
    ])

    this.user = user
    this.cards = cards
    this.table = table
    this.owner = owner

    this.loadTimer()
  }

  private loadTimer(): void {
    let leftTime = (localStorage.getItem(LEFT_TIME_KEY) ||
      LEFT_TIME_DEFAULT) as number
    leftTime = isNaN(leftTime) ? LEFT_TIME_DEFAULT : leftTime

    this.countdownConfig = {
      ...this.countdownConfig,
      leftTime: leftTime / 1000,
    }

    this.countdownStarted = localStorage.getItem(TIMER_STARTED_KEY) === 'true'

    let minutes = (localStorage.getItem(MINUTES_KEY) ||
      MINUTES_DEFAULT) as number
    minutes = isNaN(minutes) ? MINUTES_DEFAULT : minutes
    this.minutes = minutes
  }

  async handleUsernameChange(name: string) {
    await this.userService.changeName(name.slice(0, 20))
  }

  async handleTableNameChange(name: string) {
    await this.tableService.changeName(name.slice(0, 40))
  }

  handleToggleAddAnotherTask(event: Event): void {
    event.preventDefault()
    this.toggleAddAnotherTask = !this.toggleAddAnotherTask
  }

  handleStartTimer(minutes: number): void {
    this.countdownStarted = true

    this.countdownConfig = {
      ...this.countdownConfig,
      leftTime: 60 * minutes,
    }

    localStorage.setItem(TIMER_STARTED_KEY, 'true')

    localStorage.setItem(MINUTES_KEY, `${minutes}`)
  }

  handleRestartTimer(): void {
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

  handleTaskToVote(id: number) {
    if (this.votingTask === id) {
      this.votingTask = null
      return
    }

    this.votingTask = id

    this.tableService.selectTask()
  }

  handleVote({ id, value }: { id: string; value: number }) {
    this.votedCardId = id
    this.vote = { player: 'doug', estimation: value }
    this.votes = new Array(this.players.length).fill(this.vote)
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
}
