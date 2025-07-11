import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core'
import { provideRouter, withComponentInputBinding } from '@angular/router'

import { registerLocaleData } from '@angular/common'
import { provideHttpClient } from '@angular/common/http'
import pt from '@angular/common/locales/pt'
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app'
import {
  initializeAppCheck,
  provideAppCheck,
  ReCaptchaV3Provider,
} from '@angular/fire/app-check'
import { getFirestore, provideFirestore } from '@angular/fire/firestore'
import { FormsModule } from '@angular/forms'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { IconDefinition } from '@ant-design/icons-angular'
import {
  CloseCircleOutline,
  CodeOutline,
  CoffeeOutline,
  DeleteOutline,
  EnterOutline,
  GithubOutline,
  InfoCircleOutline,
  LinkedinOutline,
  LinkOutline,
  LoadingOutline,
  PlayCircleOutline,
  PlusCircleOutline,
  QuestionOutline,
  RedoOutline,
  UserOutline,
  WhatsAppOutline,
} from '@ant-design/icons-angular/icons'
import { provideNzI18n, pt_BR } from 'ng-zorro-antd/i18n'
import { provideNzIcons } from 'ng-zorro-antd/icon'
import { environment } from '../environments/environment'
import { routes } from './app.routes'

registerLocaleData(pt)

const icons: IconDefinition[] = [
  CoffeeOutline,
  QuestionOutline,
  UserOutline,
  PlayCircleOutline,
  PlusCircleOutline,
  CloseCircleOutline,
  RedoOutline,
  PlusCircleOutline,
  GithubOutline,
  LinkedinOutline,
  WhatsAppOutline,
  CodeOutline,
  LinkOutline,
  DeleteOutline,
  EnterOutline,
  InfoCircleOutline,
  LoadingOutline,
]

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideFirebaseApp(() => initializeApp(environment.firebaseOptions)),
    provideFirestore(() => getFirestore()),
    provideNzI18n(pt_BR),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideNzIcons(icons),
    provideAppCheck(() => {
      return initializeAppCheck(getApp(), {
        provider: new ReCaptchaV3Provider(environment.appCheckSiteKey),
        isTokenAutoRefreshEnabled: true,
      })
    }),
  ],
}
