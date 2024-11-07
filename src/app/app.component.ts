import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { traceUntilFirst } from '@angular/fire/performance';
import { RouterOutlet } from '@angular/router';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
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
    RouterOutlet,
    CommonModule,
    NzDropDownModule,
    NzButtonModule,
    NzLayoutModule,
    NzTypographyModule,
    NzFlexModule,
    NzGridModule,
    NzIconModule,
    NzDividerModule,
    NzListModule,
    NzAvatarModule,
    NzPageHeaderModule,
    NzSpaceModule,
    NzFormModule,
    CountdownModule,
    NzWaterMarkModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'scrum-poker';

  public readonly testDocValue$: Observable<{ quantidade: number }>;

  cards = ['0', '1', '2', '4', '8', '16', '32', '64'];

  spectators = new Array(3).fill(null).map((_, index) => `Espectador ${index}`);

  players = new Array(3).fill(null).map((_, index) => `Jogador ${index}`);

  createdBy = 'você';

  inviteLink = `${environment.appUrl}/tables/4ca022b9-649e-412c-9f27-6aa835b45c83`;

  tasks = new Array(3).fill(null).map((_, index) => ({
    title: `Titulo ${index}`,
    link: `https://scrum-poker.opentools.org?taksId=${index}`,
  }));

  points = 8;

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
}
