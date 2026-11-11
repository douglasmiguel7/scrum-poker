import { FirebaseOptions } from '@angular/fire/app'

export interface EnvironmentType {
  appUrl: string
  appVersion: string
  appVersionTitle: string
  tablesEndpoint: string
  firebaseOptions: FirebaseOptions
  appCheckSiteKey: string
}

export interface MergedId {
  id: string
  tableId: string
  userId: string
}

export type CollectionName =
  | 'tables'
  | 'tasks'
  | 'users'
  | 'cards'
  | 'owners'
  | 'players'
  | 'spectators'
  | 'userRoles'
  | 'votes'
  | 'selectedTasks'
  | 'countdowns'
  | 'minutes'
  | 'suggestions'
