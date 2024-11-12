import { ActivatedRoute } from '@angular/router'
import { TABLE_ID_KEY } from './constant'
import { randomUuid } from './uuid'

export const getTableId = (route: ActivatedRoute): string => {
  return (
    route.snapshot.paramMap.get('id') ||
    localStorage.getItem(TABLE_ID_KEY) ||
    randomUuid()
  )
}
