import { formatISO } from 'date-fns'

export const getCurrentDate = (): string => {
  return formatISO(new Date())
}
