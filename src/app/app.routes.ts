import { Routes, UrlMatcher, UrlMatchResult, UrlSegment } from '@angular/router'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { TableComponent } from './table/table.component'
import { validateUuid } from './utils/id'

const matcher: UrlMatcher = (segments: UrlSegment[]): UrlMatchResult | null => {
  const isRoot = segments.length === 0
  if (isRoot) {
    return { consumed: segments }
  }

  const hasTwoSegments = segments.length === 2
  if (!hasTwoSegments) {
    return null
  }

  const id = segments[1].path

  const valid = validateUuid(id)
  if (!valid) {
    return null
  }

  return {
    consumed: segments,
    posParams: { id: new UrlSegment(id, {}) },
  }
}

export const routes: Routes = [
  {
    matcher,
    component: TableComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
]
