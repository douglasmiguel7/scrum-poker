import { CountdownConfig } from 'ngx-countdown'

export interface Countdown extends CountdownConfig {
  started: boolean
  minutes: number
  leftTime: number
}
