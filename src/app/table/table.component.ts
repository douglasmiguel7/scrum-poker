import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'

import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
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
import { Countdown } from '../model/countdown.model'
import { Table } from '../model/table.model'
import { NewTask, Task } from '../model/task.model'
import { UserRole } from '../model/user-role.model'
import { User } from '../model/user.model'
import { Vote, VoteValueQuantity } from '../model/vote.model'
import { CardService } from '../services/card.service'
import { CountdownService } from '../services/countdown.service'
import { OwnerService } from '../services/owner.service'
import { PlayerService } from '../services/player.service'
import { SpectatorService } from '../services/spectator.service'
import { TableService } from '../services/table.service'
import { TaskService } from '../services/task.service'
import { UserRoleService } from '../services/user-role.service'
import { UserService } from '../services/user.service'
import { VoteService } from '../services/vote.service'
import { init } from '../utils/id'

const LEFT_TIME_KEY = 'time'
const LEFT_TIME_DEFAULT = 0
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
  title = 'scrum-pokera'

  // old
  countdownConfig: CountdownConfig = {
    demand: false,
    format: 'mm:ss',
    leftTime: LEFT_TIME_DEFAULT,
    notify: 0,
  }
  minutes = 0
  minutesOptions = [1, 2, 5, 10, 20, 30]
  cardsRevealed = false

  // new
  env = environment
  toggleAddAnotherTask = false
  validateForm: FormGroup
  changingUserRole = false

  user$: Observable<User>
  table$: Observable<Table>
  owner$: Observable<User>
  cards$: Observable<Card[]>
  tasks$: Observable<Task[]>
  players$: Observable<User[]>
  spectators$: Observable<User[]>
  userRole$: Observable<UserRole>
  taskEstimationTotal$: Observable<number>
  votes$: Observable<Vote[]>
  vote$: Observable<Vote>
  selectedTask$: Observable<Task>
  votesEstimationTotal$: Observable<number>
  votesEstimationAverage$: Observable<number>
  voteValueQuantities$: Observable<VoteValueQuantity[]>
  countdown$: Observable<Countdown>
  countdownStarted$: Observable<boolean>

  constructor(
    private fb: NonNullableFormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private tableService: TableService,
    private cardService: CardService,
    private taskService: TaskService,
    private ownerService: OwnerService,
    private playerService: PlayerService,
    private spectatorService: SpectatorService,
    private userRoleService: UserRoleService,
    private voteService: VoteService,
    private countdownService: CountdownService,
  ) {
    console.log('table component constructor')

    init(this.route)

    this.validateForm = this.fb.group({
      title: this.fb.control('', [Validators.required]),
      link: this.fb.control(''),
    })

    this.user$ = this.userService.getUserObservable()
    this.cards$ = this.cardService.getCardsObservable()
    this.table$ = this.tableService.getTableObservable()
    this.owner$ = this.ownerService.getOwnerObservable()
    this.tasks$ = this.taskService.getTasksObservable()
    this.selectedTask$ = this.taskService.getSelectedTaskIdObservable()
    this.taskEstimationTotal$ = this.taskService.getEstimationTotalObservable()
    this.players$ = this.playerService.getPlayersObservable()
    this.spectators$ = this.spectatorService.getSpectatorsObservable()
    this.userRole$ = this.userRoleService.getUserRoleObservable()
    this.votes$ = this.voteService.getVotesObservable()
    this.vote$ = this.voteService.getVoteObservable()
    this.votesEstimationAverage$ =
      this.voteService.getEstimationAverageObservable()
    this.votesEstimationTotal$ = this.voteService.getEstimationTotalObservable()
    this.voteValueQuantities$ =
      this.voteService.getEstimationByQuantityObservable()
    this.countdown$ = this.countdownService.getCountdownObservable()
    this.countdownStarted$ =
      this.countdownService.getCountdownStartedObservable()
  }

  async ngOnInit(): Promise<void> {
    console.log('init table component')

    // this.loadTimer()

    this.tableService.create()
    this.userService.create()
    this.spectatorService.create()
    this.userRoleService.create()
    this.countdownService.create()
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

    // this.countdownStarted = localStorage.getItem(TIMER_STARTED_KEY) === 'true'

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
    if (!this.validateForm?.valid) {
      return
    }

    const value = this.validateForm.value as NewTask

    this.taskService.save(value)

    this.validateForm.reset()
  }

  handleDeleteTask(id: string) {
    this.taskService.delete(id)
  }

  handleStartCountdown(minutes: number): void {
    this.countdownService.start(minutes)
  }

  handleRestartCountdown(): void {
    this.countdownService.restart()
  }

  handleStopCountdown(): void {
    this.countdownService.stop()
  }

  handleAddOneMinute(): void {
    this.countdownService.addOneMinute()
  }

  handleCountdownEvent(event: CountdownEvent): void {
    this.countdownService.handleEvent(event)
  }

  handleSelectedTask(task: Task) {
    this.taskService.select(task)
  }

  handleTaskLinkChange(id: string, link: string) {
    this.taskService.update(id, { link })
  }

  handleTaskTitleChange(id: string, title: string) {
    this.taskService.update(id, { title })
  }

  async handleVote(card: Card) {
    const exists = await this.voteService.exists()

    if (exists) {
      await this.voteService.update(card)
      return
    }

    if (!exists) {
      await this.voteService.create(card)
      return
    }
  }

  handleCardsRevealed() {
    this.cardsRevealed = !this.cardsRevealed
  }

  async handleUserRoleChange() {
    this.changingUserRole = true
    await this.userRoleService.switchRole()
    this.changingUserRole = false
  }
}
