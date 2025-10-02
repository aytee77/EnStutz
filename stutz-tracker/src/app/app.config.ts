import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {provideHttpClient} from '@angular/common/http';
import {PlayernamePipe} from './shared/pipes/playername-pipe';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(),
        PlayernamePipe,
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes), provideClientHydration(withEventReplay()),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore())
    ]
};
