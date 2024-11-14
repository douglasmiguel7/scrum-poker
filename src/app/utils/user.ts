import { USER_ID_KEY } from './constant'
import { randomUuid } from './uuid'

export const getUserId = (): string => {
  const id = localStorage.getItem(USER_ID_KEY) || randomUuid()

  localStorage.setItem(USER_ID_KEY, id)

  return id
}
