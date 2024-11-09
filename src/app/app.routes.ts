import { Routes } from '@angular/router'
import { TableComponent } from './table/table.component'
import { TablesComponent } from './tables/tables.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'

export const routes: Routes = [
  {
    path: 'tables',
    component: TablesComponent,
  },
  {
    path: 'table',
    component: TableComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
]
