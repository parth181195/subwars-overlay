import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}), provideRouter(routes), provideFirebaseApp(() => initializeApp({
    "projectId": "notes-f8d03",
    "appId": "1:940075348159:web:c136a8d4a756a2e778d60a",
    "storageBucket": "notes-f8d03.firebasestorage.app",
    "apiKey": "AIzaSyBb1W7h11AK4WbxvOR1t8x3PDaIv18BLvk",
    "authDomain": "notes-f8d03.firebaseapp.com",
    "messagingSenderId": "940075348159",
    "measurementId": "G-2E1PEMCPB3"
  })), provideFirestore(() => getFirestore()), provideAnimationsAsync()]
};
