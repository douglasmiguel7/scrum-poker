import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { traceUntilFirst } from '@angular/fire/performance';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzWaterMarkModule } from 'ng-zorro-antd/water-mark';
import {
  CountdownConfig,
  CountdownEvent,
  CountdownModule,
  CountdownStatus,
} from 'ngx-countdown';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

const LEFT_TIME_KEY = 'time';
const LEFT_TIME_DEFAULT = 0;
const TIMER_STARTED_KEY = 'time_started';
const MINUTES_KEY = 'selected_minutes';
const MINUTES_DEFAULT = 1;

@Component({
  selector: 'app-root',
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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'scrum-poker';

  public readonly testDocValue$: Observable<{ quantidade: number }>;

  cards: {
    id: string;
    icon: string | null;
    text: string | null;
    tip: string | null;
    value: number;
  }[] = [
    {
      id: '11610a31-9fea-4e8e-ab42-99d0ef54ffbe',
      text: '0',
      value: 0,
      icon: null,
      tip: 'Já esta pronto',
    },
    {
      id: '02694b93-b3cd-4fb2-851c-70447aea8184',
      text: '1',
      value: 1,
      icon: null,
      tip: null,
    },
    {
      id: '6f7b2fc8-7c50-426b-bf6e-6cf6e83c3b4d',
      text: '2',
      value: 2,
      icon: null,
      tip: null,
    },
    {
      id: 'a45d0965-f34f-4946-9ce5-521f8401a44c',
      text: '4',
      value: 4,
      icon: null,
      tip: null,
    },
    {
      id: 'ceeebc75-8a19-4653-a5d0-591eee3e24c7',
      text: '8',
      value: 8,
      icon: null,
      tip: null,
    },
    {
      id: 'fbdd9770-519c-4880-9c7b-36be9d3295f8',
      text: '16',
      value: 16,
      icon: null,
      tip: null,
    },
    {
      id: '483f563c-10f9-41b5-9eb9-9383a446dfee',
      text: '32',
      value: 32,
      icon: null,
      tip: null,
    },
    {
      id: 'de7f4b66-fd99-4582-844c-c6800f91bfe0',
      text: '64',
      value: 64,
      icon: null,
      tip: null,
    },
    {
      id: 'e6f44190-fbc4-4756-b82a-e8fad010fa5b',
      text: null,
      value: 0,
      icon: 'question',
      tip: 'Falta informção',
    },
    {
      id: '03446fa7-aab0-477c-8fae-0405557112f2',
      text: '0',
      value: 0,
      icon: 'coffee',
      tip: 'Pausa para café',
    },
  ];

  spectators = new Array(3)
    .fill(null)
    .map((_, index) => `Exemplo nome grande ${index}`);

  players = new Array(3).fill(null).map((_, index) => `Maria ${index}`);

  createdBy = 'você';

  inviteLink = `${environment.appUrl}/tables/4ca022b9-649e-412c-9f27-6aa835b45c83`;

  tasks: { id: number; title: string; link: string; estimation: number }[] =
    new Array(2).fill(null).map((_, index) => ({
      id: index,
      title: `Titulo ${index}`,
      link: `https://scrum-poker.opentools.org?taksId=${index}`,
      estimation: Math.floor(Math.random() * (index + 1) * 2),
    }));

  estimation: number = this.tasks
    .map((task) => task.estimation)
    .reduce((prev, curr) => prev + curr);

  toggleAddAnotherTask = false;

  countdownStarted = false;

  countdownConfig: CountdownConfig = {
    demand: false,
    format: 'mm:ss',
    leftTime: LEFT_TIME_DEFAULT,
    notify: 0,
  };

  minutes: number = 0;

  minutesOptions = [1, 2, 5, 10, 20, 30];

  votingTask: number | null = null;

  votedCardId: string | null = null;

  constructor(firestore: Firestore) {
    const ref = doc(firestore, 'teste/config');
    this.testDocValue$ = docData(ref).pipe(traceUntilFirst('firestore'));
  }

  ngOnInit(): void {
    let leftTime = (localStorage.getItem(LEFT_TIME_KEY) ||
      LEFT_TIME_DEFAULT) as number;
    leftTime = isNaN(leftTime) ? LEFT_TIME_DEFAULT : leftTime;

    this.countdownConfig = {
      ...this.countdownConfig,
      leftTime: leftTime / 1000,
    };

    this.countdownStarted = localStorage.getItem(TIMER_STARTED_KEY) === 'true';

    let minutes = (localStorage.getItem(MINUTES_KEY) ||
      MINUTES_DEFAULT) as number;
    minutes = isNaN(minutes) ? MINUTES_DEFAULT : minutes;
    this.minutes = minutes;
  }

  handleToggleAddAnotherTask(): void {
    this.toggleAddAnotherTask = !this.toggleAddAnotherTask;
  }

  handleStartTimer(minutes: number): void {
    this.countdownStarted = true;

    this.countdownConfig = {
      ...this.countdownConfig,
      leftTime: 60 * minutes,
    };

    localStorage.setItem(TIMER_STARTED_KEY, 'true');

    localStorage.setItem(MINUTES_KEY, `${minutes}`);
  }

  handleRestartTimer(): void {
    this.countdownConfig = {
      ...this.countdownConfig,
      leftTime: 60 * this.minutes,
    };
  }

  handleStopTimer(): void {
    this.countdownStarted = false;

    this.countdownConfig = {
      ...this.countdownConfig,
      leftTime: 0,
    };

    localStorage.setItem(TIMER_STARTED_KEY, 'false');

    localStorage.setItem(LEFT_TIME_KEY, '0');
  }

  handleAddOneMinute(): void {
    let leftTime = (localStorage.getItem(LEFT_TIME_KEY) || 0) as number;
    if (leftTime <= 0 || isNaN(leftTime)) {
      leftTime = LEFT_TIME_DEFAULT;
    }

    this.countdownConfig = {
      ...this.countdownConfig,
      leftTime: leftTime / 1000 + 60,
    };
  }

  handleTimerEvent(event: CountdownEvent): void {
    const status: Record<number, string> = {
      [CountdownStatus.done]: 'done',
      [CountdownStatus.ing]: 'ing',
      [CountdownStatus.pause]: 'pause',
      [CountdownStatus.stop]: 'stop',
    };

    console.log(
      `(new timer event) action: ${event.action} - status: ${
        status[event.status]
      } - text: ${event.text} - left: ${event.left}`
    );

    switch (event.action) {
      case 'done':
        this.countdownStarted = false;

        localStorage.setItem(LEFT_TIME_KEY, '0');

        break;
      case 'notify':
        if (!this.countdownStarted) {
          break;
        }

        localStorage.setItem(LEFT_TIME_KEY, `${event.left}`);

        break;
    }
  }

  handleTaskToVote(id: number) {
    if (this.votingTask === id) {
      this.votingTask = null;
      return;
    }

    this.votingTask = id;
  }

  handleVote(cardId: string) {
    this.votedCardId = cardId;
  }
}
