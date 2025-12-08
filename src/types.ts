import { FirebaseOptions } from '@angular/fire/app'

interface Contact {
  title: string
  value: string
}

export interface EnvironmentType {
  appUrl: string
  appVersion: string
  appVersionTitle: string
  githubUsername: string
  githubProfileUrl: string
  repositoryUrl: string
  linkedInProfileUrl: string
  profilePictureUrl: string
  tablesEndpoint: string
  contacts: Contact[]
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
