import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import pt from '@angular/common/locales/pt';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { IconDefinition } from '@ant-design/icons-angular';
import {
  CloseCircleOutline,
  CoffeeOutline,
  FastForwardOutline,
  PlayCircleOutline,
  PlusCircleOutline,
  QuestionOutline,
  RedoOutline,
  UserOutline,
} from '@ant-design/icons-angular/icons';
import { provideNzI18n, pt_BR } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { routes } from './app.routes';

registerLocaleData(pt);

const icons: IconDefinition[] = [
  FastForwardOutline,
  CoffeeOutline,
  QuestionOutline,
  UserOutline,
  PlayCircleOutline,
  PlusCircleOutline,
  CloseCircleOutline,
  RedoOutline,
  PlusCircleOutline,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'scrum-poker-f387c',
        appId: '1:257699867582:web:d4e569c7ad67e3a8a627ef',
        storageBucket: 'scrum-poker-f387c.firebasestorage.app',
        apiKey: 'AIzaSyCmUQk2t8bBqMx4-Ysv9LAU3iTRsMvUD2c',
        authDomain: 'scrum-poker-f387c.firebaseapp.com',
        messagingSenderId: '257699867582',
        measurementId: 'G-NNZZNKMWBV',
      })
    ),
    provideFirestore(() => getFirestore()),
    provideNzI18n(pt_BR),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideNzIcons(icons),
  ],
};
