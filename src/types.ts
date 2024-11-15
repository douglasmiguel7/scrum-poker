export interface EnvironmentType {
  appUrl: string
  appVersion: string
  appVersionTitle: string
  githubUsername: string
  githubProfileUrl: string
  repositoryUrl: string
  linkedInProfileUrl: string
  phoneNumber: string
  email: string
  profilePictureUrl: string
  tablesEndpoint: string
  whatsappUrl: string
  contacts: { title: string; value: string }[]
}

export interface WithUserId {
  userId: string
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
