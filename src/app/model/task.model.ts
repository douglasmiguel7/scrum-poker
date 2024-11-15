export interface NewTask {
  title: string
  link?: string
}

export interface Task {
  id: string
  tableId: string
  title: string
  link?: string
  estimation: number
  selected: boolean
  voted: boolean
  createdAt: string
  updatedAt: string
}
