import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { traceUntilFirst } from '@angular/fire/performance';
import { RouterOutlet } from '@angular/router';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { Observable } from 'rxjs';

import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    NzPageHeaderModule,
    NzDropDownModule,
    NzButtonModule,
    NzLayoutModule,
    NzTypographyModule,
    NzFlexModule,
    NzGridModule,
    NzIconModule,
    NzDividerModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'scrum-poker';

  public readonly testDocValue$: Observable<{ quantidade: number }>;

  cards = ['0', '1', '2', '4', '8', '16', '32', '64'];

  spectators = ['Douglas', 'Fernando', 'Fabricio'];

  players = ['Carlos', 'Augusto', 'Rodrigo'];

  createdBy = 'você';

  constructor(firestore: Firestore) {
    const ref = doc(firestore, 'teste/config');
    this.testDocValue$ = docData(ref).pipe(traceUntilFirst('firestore'));
  }

  ngOnInit(): void {}
}
