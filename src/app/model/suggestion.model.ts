export interface NewSuggestion {
  text: string
}

export interface Suggestion {
  id: string
  userId: string
  tableId: string
  text: string
  createdAt: string
  updatedAt: string
}
