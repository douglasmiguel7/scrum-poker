import { ActivatedRoute } from '@angular/router'
import { TABLE_KEY } from './constant'
import { randomUuid } from './uuid'

export const getTableId = (route: ActivatedRoute): string => {
  return (
    route.snapshot.paramMap.get('id') ||
    localStorage.getItem(TABLE_KEY) ||
    randomUuid()
  )
}
