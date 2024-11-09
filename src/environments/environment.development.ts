import { EnvironmentType } from '../types'
import common from './environment.common'

export const environment: EnvironmentType = {
  ...common,
  appUrl: 'http://localhost:4200',
}
