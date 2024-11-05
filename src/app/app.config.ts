import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';

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
  ],
};
