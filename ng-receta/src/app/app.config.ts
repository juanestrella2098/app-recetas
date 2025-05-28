import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ng-recetas-3f4ce',
        appId: '1:999594817775:web:d4f232d49f3cfeb1c2031a',
        storageBucket: 'ng-recetas-3f4ce.firebasestorage.app',
        apiKey: 'AIzaSyBfcuaDe8X0lt0m4hw9rq4Wep4MrvF6M1k',
        authDomain: 'ng-recetas-3f4ce.firebaseapp.com',
        messagingSenderId: '999594817775',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
