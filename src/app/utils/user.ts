import { randomUuid } from './uuid'

export const getUserId = (): string => {
  let id = localStorage.getItem('user_id')

  if (id !== null) {
    return id
  }

  id = randomUuid()

  localStorage.setItem('user_id', id)

  return id
}
