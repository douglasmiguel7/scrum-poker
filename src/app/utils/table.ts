import { ActivatedRoute } from '@angular/router'
import { randomUuid } from './uuid'

export const getTableId = (route: ActivatedRoute): string => {
  return route.snapshot.paramMap.get('id') || randomUuid()
}
