import { Routes } from '@angular/router'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { TableComponent } from './table/table.component'

export const routes: Routes = [
  {
    path: 'tables/:id',
    component: TableComponent,
  },

  {
    path: '**',
    component: PageNotFoundComponent,
  },
]
