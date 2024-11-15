import { ActivatedRoute } from '@angular/router'
import { v4, validate, version } from 'uuid'
import { MergedId } from '../../types'
import { TABLE_ID_KEY, USER_ID_KEY } from './constant'

export const randomUuid = () => v4()

export const validateUuid = (uuid: string): boolean => {
  return validate(uuid) && version(uuid) === 4
}

export const getTableId = (route: ActivatedRoute): string => {
  return (
    route.snapshot.paramMap.get('id') ||
    localStorage.getItem(TABLE_ID_KEY) ||
    randomUuid()
  )
}

export const getUserId = (): string => {
  const id = localStorage.getItem(USER_ID_KEY) || randomUuid()

  localStorage.setItem(USER_ID_KEY, id)

  return id
}

export const getMergedId = (route: ActivatedRoute): MergedId => {
  const tableId = getTableId(route)
  const userId = getUserId()

  return {
    id: `${tableId}-${userId}`,
    tableId,
    userId,
  }
}
