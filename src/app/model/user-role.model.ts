export type Role = 'player' | 'spectator'

export interface UserRole {
  role: Role
  tableId: string
}
