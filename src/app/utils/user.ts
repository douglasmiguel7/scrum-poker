import { USER_ID_KEY } from './constant'
import { randomUuid } from './uuid'

export const getUserId = (): string => {
  let id = localStorage.getItem(USER_ID_KEY)

  if (id !== null) {
    return id
  }

  id = randomUuid()

  localStorage.setItem(USER_ID_KEY, id)

  return id
}
