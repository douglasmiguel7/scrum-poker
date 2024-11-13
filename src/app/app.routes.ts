import { Routes, UrlMatcher, UrlMatchResult, UrlSegment } from '@angular/router'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { TableComponent } from './table/table.component'
import { validateUuid } from './utils/uuid'

const notFound: UrlSegment = new UrlSegment('not-found', {})

const matcher: UrlMatcher = (url: UrlSegment[]): UrlMatchResult | null => {
  const isRoot = url.length === 0
  if (isRoot) {
    return { consumed: url }
  }

  const hasTwoSegments = url.length === 2
  if (!hasTwoSegments) {
    return { consumed: [notFound] }
  }

  const id = url[1].path

  const valid = validateUuid(id)
  if (!valid) {
    return { consumed: [notFound] }
  }

  return { consumed: url, posParams: { id: new UrlSegment(id, {}) } }
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
