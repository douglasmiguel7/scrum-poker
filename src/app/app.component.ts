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
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { Observable } from 'rxjs';

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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'scrum-poker';

  public readonly testDocValue$: Observable<{ quantidade: number }>;

  cards = ['0', '1', '2', '4', '8', '16', '32', '64'];

  spectators = new Array(3).fill('').map((_, index) => `Espectador ${index}`);

  players = new Array(3).fill('').map((_, index) => `Jogador ${index}`);

  createdBy = 'você';

  inviteLink = 'tiranu';

  constructor(firestore: Firestore) {
    const ref = doc(firestore, 'teste/config');
    this.testDocValue$ = docData(ref).pipe(traceUntilFirst('firestore'));
  }

  ngOnInit(): void {}
}
