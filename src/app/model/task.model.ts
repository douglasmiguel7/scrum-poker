export interface NewTask {
  title: string
  link: string | null
}

export interface SelectedTask {
  id: string
}

export interface Task {
  id: string
  tableId: string
  title: string
  link?: string
  estimation: number
  voted: boolean
  createdAt: string
  updatedAt: string
}
